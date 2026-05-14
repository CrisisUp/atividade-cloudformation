const TASKS_DATA = [
  {
    id: "t1",
    num: "1",
    title: "Configurar o Ambiente — CloudShell + Terraform",
    tag: "Setup",
    tagColor: "#5B21B6",
    tagBg: "#EDE9FE",
    numColor: "#fff",
    numBg: "#7B42BC",
    open: true,
    info: "ℹ️ O AWS CloudShell já tem o AWS CLI configurado com as credenciais da sua sessão. Você só precisa instalar o Terraform uma vez por sessão do CloudShell.",
    steps: [
      {
        title: "Passo 1 — Abrir o CloudShell",
        items: [
          "<span class=\"nav-path\">AWS Console</span> · Clique no ícone de terminal <strong>📟</strong> na barra superior (ao lado do sino de notificações) <strong>OU</strong> acesse diretamente: <span class=\"nav-path\">AWS Console → CloudShell</span>",
          "Aguarde o CloudShell inicializar (pode levar 20-30 segundos na primeira vez)",
          "Confirme que as credenciais estão funcionando: digite <code>aws sts get-caller-identity</code> → deve retornar seu Account ID e o role <code>LabRole</code>",
        ],
      },
      {
        title: "Passo 2 — Instalar o Terraform no CloudShell (Padrão 2026)",
        items: [
          "Copie e cole os comandos abaixo para configurar o repositório da HashiCorp e instalar o Terraform:",
        ],
      },
    ],
    codeId: "c1",
    code: `sudo yum install -y yum-utils\nsudo yum-config-manager --add-repo https://rpm.releases.hashicorp.com/AmazonLinux/hashicorp.repo\nsudo yum install -y terraform\nterraform version`,
    expected: "✅ Esperado: <code>Terraform v1.x.x</code> impresso no terminal. O Terraform está pronto para uso.",
    stepsExtra: [
      {
        title: "Passo 3 — Criar o diretório de trabalho",
        items: [
          "Crie uma pasta dedicada para evitar bagunça no diretório home:",
        ],
      },
    ],
    codeExtraId: "c2",
    codeExtra: `mkdir -p ~/techstock-tf-lab && cd ~/techstock-tf-lab\nls -la`,
    checklist: [
      "CloudShell aberto e respondendo",
      "Credenciais validadas (LabRole)",
      "Terraform instalado com sucesso",
      "Diretório ~/techstock-tf-lab criado",
    ],
  },
  {
    id: "t2",
    num: "2",
    title: "Primeiro Recurso — EC2 com HCL e AL2025",
    tag: "HCL Básico",
    tagColor: "#1E40AF",
    tagBg: "#EFF6FF",
    numColor: "#fff",
    numBg: "#1D4ED8",
    info: "ℹ️ Você vai escrever seu primeiro arquivo HCL e executar o ciclo completo: <strong>init → validate → plan → apply</strong>.",
    concept: {
      title: "💡 HCL vs YAML",
      body: "O Terraform usa HCL (HashiCorp Configuration Language), que permite referências diretas e lógica real. Diferente do CloudFormation, o Terraform gerencia o estado em um arquivo local (state), o que dá mais velocidade e flexibilidade.",
    },
    steps: [
      {
        title: "Passo 1 — Configure o Provider AWS",
        items: [
          "No CloudShell, crie o arquivo <span class=\"shell-path\">provider.tf</span> com as configurações básicas:",
        ],
      },
    ],
    codeId: "c3",
    code: `cat > provider.tf << 'EOF'\nterraform {\n  required_version = \">= 1.6.0\"\n  required_providers {\n    aws = {\n      source  = \"hashicorp/aws\"\n      version = \"~> 5.0\"\n    }\n  }\n}\n\nprovider \"aws\" {\n  region = \"us-east-1\"\n}\nEOF`,
    stepsExtra: [
      {
        title: "Passo 2 — Defina a Infraestrutura (AL2025 + t3.micro)",
        items: [
          "Crie o <span class=\"shell-path\">main.tf</span> usando um Data Source para buscar a AMI mais recente do Amazon Linux 2025:",
        ],
      },
    ],
    codeExtraId: "c4",
    codeExtra: `cat > main.tf << 'EOF'\ndata \"aws_ami\" \"al2025\" {\n  most_recent = true\n  owners      = [\"amazon\"]\n  filter {\n    name   = \"name\"\n    values = [\"al2025-ami-2025*-x86_64\"]\n  }\n}\n\nresource \"aws_security_group\" \"lab\" {\n  name        = \"techstock-tf-lab-sg\"\n  description = \"SG para o lab de Terraform 2026\"\n\n  ingress {\n    from_port   = 80\n    to_port     = 80\n    protocol    = \"tcp\"\n    cidr_blocks = [\"0.0.0.0/0\"]\n  }\n\n  egress {\n    from_port   = 0\n    to_port     = 0\n    protocol    = \"-1\"\n    cidr_blocks = [\"0.0.0.0/0\"]\n  }\n\n  tags = {\n    Name      = \"techstock-tf-lab-sg\"\n    ManagedBy = \"Terraform\"\n  }\n}\n\nresource \"aws_instance\" \"lab\" {\n  ami           = data.aws_ami.al2025.id\n  instance_type = \"t3.micro\"\n  vpc_security_group_ids = [aws_security_group.lab.id]\n  iam_instance_profile   = \"LabInstanceProfile\"\n\n  tags = {\n    Name        = \"techstock-tf-lab-ec2\"\n    ManagedBy   = \"Terraform\"\n  }\n}\nEOF`,
    finishSteps: {
      title: "Passo 3 — Ciclo de Execução",
      items: [
        "<code>terraform init</code> — Inicializa o projeto e baixa o provider AWS",
        "<code>terraform plan</code> — Mostra o que será criado",
        "<code>terraform apply</code> — Cria os recursos (digite 'yes' para confirmar)",
      ],
    },
    expected: "✅ Mensagem: <code>Apply complete! Resources: 2 added</code>. EC2 visível no Console com tag ManagedBy: Terraform.",
    checklist: [
      "terraform init executado com sucesso",
      "terraform plan revisado (2 recursos)",
      "terraform apply finalizado",
      "Instância t3.micro rodando no <span class=\"nav-path\">Console EC2 → Instances</span>",
    ],
  },
  {
    id: "t3",
    num: "3",
    title: "Plan como Ferramenta de Revisão",
    tag: "Plan",
    tagColor: "#14532D",
    tagBg: "#F0FDF4",
    numColor: "#fff",
    numBg: "#16A34A",
    info: "ℹ️ O <code>terraform plan</code> mostra exatamente o que vai mudar. Recursos com <strong>forces replacement</strong> serão destruídos e recriados.",
    concept: {
      title: "💡 Mudanças In-Place vs Replacement",
      body: "Algumas mudanças (como Tags) são aplicadas sem desligar o recurso (~ update in-place). Outras (como mudar o nome de um SG) exigem a destruição e recriação do recurso (-/+ replace).",
    },
    steps: [
      {
        title: "Passo 1 — Teste um Update In-Place",
        items: [
          "Edite o <span class=\"shell-path\">main.tf</span> e adicione uma tag <code>Owner = 'seu-nome'</code> na instância EC2.",
          "Execute <code>terraform plan</code> e observe o símbolo <code>~</code>.",
        ],
      },
      {
        title: "Passo 2 — Teste um Replacement (Cuidado)",
        items: [
          "Mude o <code>name</code> do Security Group no código para <code>techstock-v2</code>.",
          "Execute <code>terraform plan</code> e observe o aviso <code>forces replacement</code>.",
          "<strong>Não aplique esta mudança!</strong> Reverta o nome antes de prosseguir para não perder a instância.",
        ],
      },
    ],
    hint: "📸 Use o <strong>Amazon Q</strong> no terminal se tiver dúvidas sobre o impacto de um plano específico.",
    expected: "✅ Você entendeu a diferença entre uma mudança estética (Tag) e uma mudança estrutural (Nome do SG).",
    checklist: [
      "Plan de tag mostrou apenas modificação (~)",
      "Plan de nome do SG mostrou recriação (-/+)",
      "Nome do SG revertido para o original",
    ],
  },
  {
    id: "t4",
    num: "4",
    title: "Detecção de Desvios (Drift)",
    tag: "State",
    tagColor: "#0C4A6E",
    tagBg: "#E0F2FE",
    numColor: "#fff",
    numBg: "#0369A1",
    info: "ℹ️ O Terraform detecta se alguém mexeu na infraestrutura manualmente pelo Console AWS.",
    steps: [
      {
        title: "Passo 1 — Provoque um Desvio",
        items: [
          "Vá ao <span class=\"nav-path\">Console EC2 → Instances</span> e adicione manualmente uma tag <code>DriftTag = 'manual'</code> na sua instância.",
        ],
      },
      {
        title: "Passo 2 — Execute o Plan",
        items: [
          "No CloudShell, execute <code>terraform plan</code>.",
          "Observe que o Terraform detecta a tag extra e propõe REMOVÊ-LA para voltar ao estado definido no código.",
        ],
      },
    ],
    expected: "✅ O Terraform garante a governança: o código é a única fonte da verdade.",
    checklist: [
      "Tag adicionada pelo Console",
      "Terraform plan detectou o desvio",
      "Apply removeu a mudança manual",
    ],
  },
  {
    id: "t5",
    num: "5",
    title: "Variáveis e terraform.tfvars — Infra Parametrizada",
    tag: "Variables",
    tagColor: "#92400E",
    tagBg: "#FEF3C7",
    numColor: "#fff",
    numBg: "#B45309",
    info: "ℹ️ Variables no Terraform são equivalentes aos Parameters do CloudFormation. Você pode passá-las via arquivo .tfvars, variáveis de ambiente ou via linha de comando.",
    steps: [
      {
        title: "Passo 1 — Crie arquivos de variáveis",
        items: [
          "Crie o arquivo <span class=\"shell-path\">lab.tfvars</span> para definir os valores do ambiente de laboratório:",
        ],
      },
    ],
    codeId: "c5",
    code: `cat > lab.tfvars << 'EOF'\ninstance_type = \"t3.micro\"\nenvironment   = \"lab\"\nEOF`,
    stepsExtra: [
      {
        title: "Passo 2 — Use Variáveis Sensíveis",
        items: [
          "Adicione uma variável sensível que não deve aparecer nos logs:",
        ],
      },
    ],
    codeExtraId: "c6",
    codeExtra: `export TF_VAR_db_password=\"SenhaForte@2026!\"\nterraform plan -var-file=\"lab.tfvars\"`,
    expected: "✅ Variável sensível aparece como <code>(sensitive value)</code> no plan.",
    checklist: [
      "Arquivo lab.tfvars criado com sucesso",
      "Variável de ambiente TF_VAR configurada",
      "Plan executado usando -var-file",
    ],
  },
  {
    id: "t6",
    num: "6",
    title: "for_each — Criando Múltiplos Recursos",
    tag: "Loops",
    tagColor: "#5B21B6",
    tagBg: "#EDE9FE",
    numColor: "#fff",
    numBg: "#7C3AED",
    info: "ℹ️ O Terraform suporta loops nativos. Com um único bloco de código, você pode criar múltiplos recursos baseados em um mapa ou lista.",
    steps: [
      {
        title: "Passo 1 — Crie múltiplos Security Groups",
        items: [
          "Crie o arquivo <span class=\"shell-path\">sgs.tf</span> com um loop <code>for_each</code> para abrir várias portas:",
        ],
      },
    ],
    codeId: "c7",
    code: `cat > sgs.tf << 'EOF'\nvariable \"app_ports\" {\n  type = map(number)\n  default = {\n    backend    = 3000\n    monitoring = 9090\n    frontend   = 80\n  }\n}\n\nresource \"aws_security_group\" \"app_sgs\" {\n  for_each = var.app_ports\n  name     = \"techstock-\${each.key}-sg\"\n  ingress {\n    from_port   = each.value\n    to_port     = each.value\n    protocol    = \"tcp\"\n    cidr_blocks = [\"0.0.0.0/0\"]\n  }\n}\nEOF\n\nterraform apply -var-file=\"lab.tfvars\" -auto-approve`,
    expected: "✅ Resources: 3 added. Três novos Security Groups criados de uma vez.",
    checklist: [
      "Arquivo sgs.tf criado com for_each",
      "Terraform apply criou 3 recursos extras",
      "Security Groups visíveis no Console",
    ],
  },
  {
    id: "t7",
    num: "7",
    title: "Limpeza Final",
    tag: "Cleanup",
    tagColor: "#991B1B",
    tagBg: "#FEF2F2",
    numColor: "#fff",
    numBg: "#C0392B",
    info: "ℹ️ No Learner Lab, é fundamental destruir os recursos para não esgotar os créditos.",
    steps: [
      {
        title: "Destruição Total",
        items: [
          "Execute <code>terraform destroy</code>.",
          "Revise o plano de destruição e digite <code>yes</code>.",
          "Confirme que todos os recursos foram removidos do <span class=\"nav-path\">Console AWS</span>.",
        ],
      },
    ],
    expected: "✅ Apply complete! Resources: 0 added, 0 changed, 5+ destroyed.",
    warn: "⚠️ Nunca feche o lab sem garantir que o destroy foi finalizado com sucesso.",
    checklist: [
      "Terraform destroy executado",
      "Instância em estado 'Terminated' no Console",
      "Diretório de trabalho limpo (opcional)",
    ],
  },
];
