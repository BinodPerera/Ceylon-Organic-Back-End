data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# --- Networking (VPC Setup) ---
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "${var.project_name}-vpc"
  }
}

resource "aws_subnet" "public_1" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_name}-public-subnet-1"
  }
}

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.project_name}-igw"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }

  tags = {
    Name = "${var.project_name}-public-rt"
  }
}

resource "aws_route_table_association" "a1" {
  subnet_id      = aws_subnet.public_1.id
  route_table_id = aws_route_table.public.id
}

# --- IAM Role for EC2 ECR Read Access ---
resource "aws_iam_role" "ec2_role" {
  name_prefix = "${lower(var.project_name)}-ec2-role-"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecr_read" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

resource "aws_iam_instance_profile" "ec2_profile" {
  name_prefix = "${lower(var.project_name)}-ec2-profile-"
  role        = aws_iam_role.ec2_role.name
}

# --- Security Group ---
resource "aws_security_group" "web_sg" {
  name_prefix = "${lower(var.project_name)}-web-sg-"
  description = "Allow SSH and HTTP inbound traffic"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [aws_vpc.main.cidr_block]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# --- Elastic IP (Conditional) ---


# --- EC2 Instances ---

resource "aws_instance" "app" {
  ami                  = "ami-0c7217cdde317cfec"
  instance_type        = "t3.micro"
  subnet_id            = aws_subnet.public_1.id
  vpc_security_group_ids = [aws_security_group.web_sg.id]
  iam_instance_profile = aws_iam_instance_profile.ec2_profile.name

  user_data_replace_on_change = true

  user_data = <<-EOF
    #!/bin/bash
    if command -v apt-get &>/dev/null; then
      apt-get update -y
      apt-get install -y docker.io awscli
      systemctl start docker
      systemctl enable docker
      usermod -aG docker ubuntu || true
    elif command -v dnf &>/dev/null; then
      dnf update -y
      dnf install -y docker
      systemctl start docker
      systemctl enable docker
      usermod -aG docker ec2-user || true
    fi
    
    # Authenticate Docker against ECR
    aws ecr get-login-password --region \${var.aws_region} | docker login --username AWS --password-stdin \${data.aws_caller_identity.current.account_id}.dkr.ecr.\${data.aws_region.current.name}.amazonaws.com/\${lower(var.project_name)}-app
    
    # Run the container
    docker run -d -p 80:3000 \
      --name app \
      --restart always \
      -e PORT=3000 \
      \${data.aws_caller_identity.current.account_id}.dkr.ecr.\${data.aws_region.current.name}.amazonaws.com/\${lower(var.project_name)}-app:latest
  EOF

  tags = {
    Name = "${var.project_name}-app"
  }
}
