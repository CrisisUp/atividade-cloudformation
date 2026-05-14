const TASKS_DATA = [
  {
    id: "t1",
    num: "1",
    title: "Primeira Pilha — EC2 simples via Console",
    tag: "Console",
    tagColor: "#B45309",
    tagBg: "#FFF3E0",
    numColor: "#000",
    numBg: "#FF9900",
    open: true,
    info: "ℹ️ Você vai criar uma pilha (stack) CloudFormation diretamente pelo Console AWS. Sem CLI, sem arquivo local — o modelo YAML é colado direto no editor do Console.",
    concept: {
      title: "💡 O que é uma Pilha?",
      body: "Uma pilha (stack) é um conjunto de recursos AWS gerenciados como uma unidade pelo CloudFormation. Ao criar a pilha, o CloudFormation cria todos os recursos na ordem certa. Ao excluir a pilha, ele apaga tudo junto.",
    },
    steps: [
      {
        title: "Passo 1 — Inicie a criação no Console",
        items: [
          "AWS Console → CloudFormation → Clique no botão laranja <strong>Criar pilha</strong> → <strong>Com novos recursos (padrão)</strong>",
          'No campo "Pré-requisito - Preparar modelo", escolha <strong>Construir a partir do Infrastructure Composer</strong>',
          "Clique no botão <strong>Abrir no Infrastructure Composer</strong> e cole o YAML na aba <strong>Modelo (Template)</strong>:",
        ],
      },
    ],
    codeId: "c1",
    code: `AWSTemplateFormatVersion: '2010-09-09'
Description: TechStock Lab - EC2 simples via Console (2026)

Parameters:
  InstanceType:
    Type: String
    Default: t3.micro
    AllowedValues: [t3.micro, t3.small]
    Description: Tipo da instancia EC2

Resources:
  LabEC2:
    Type: AWS::EC2::Instance
    Properties:
      # Amazon Linux 2025
      ImageId: ami-0c101f26f147fa7fd 
      InstanceType: !Ref InstanceType
      IamInstanceProfile: LabInstanceProfile
      Tags:
        - Key: Name
          Value: !Sub "\${AWS::StackName}-ec2"
        - Key: ManagedBy
          Value: CloudFormation

Outputs:
  InstanceId:
    Value: !Ref LabEC2
    Description: ID da instancia criada
  PrivateIP:
    Value: !GetAtt LabEC2.PrivateIp
    Description: IP privado da instancia`,
    hint: "📸 O Composer deve mostrar o ícone da EC2 no canvas. Clique em <strong>Salvar</strong> e depois em <strong>Continuar no CloudFormation</strong> no topo da tela.",
    finishSteps: {
      title: "Passo 2 — Finalizar a Pilha",
      items: [
        "Nome da pilha: <code>techstock-lab-cf</code> → <strong>Próximo</strong>",
        "Revise os parâmetros e clique em <strong>Enviar</strong>. Acompanhe os eventos na aba <strong>Eventos</strong> até ver <code>CREATE_COMPLETE</code>.",
      ],
    },
    expected:
      "✅ Status da pilha: CREATE_COMPLETE. Aba Saídas (Outputs) mostra InstanceId e PrivateIP preenchidos automaticamente.",
    checklist: [
      "Pilha criada com status CREATE_COMPLETE",
      "Aba Eventos mostra a criação do recurso LabEC2",
      "A aba Saídas (Outputs) exibe InstanceId (i-xxxx) e PrivateIP",
      "EC2 visível em EC2 → Instâncias com tag ManagedBy: CloudFormation",
    ],
  },
  {
    id: "t2",
    num: "2",
    title: "Parâmetros e Mapeamentos — Infra Parametrizada",
    tag: "Parameters",
    tagColor: "#92400E",
    tagBg: "#FFF3E0",
    numColor: "#fff",
    numBg: "#E07B00",
    info: "ℹ️ Agora você vai criar um modelo mais completo com <strong>Parâmetros</strong> (entradas dinâmicas) e <strong>Mapeamentos</strong> (dicionário de valores por ambiente). Isso permite reutilizar o mesmo modelo para dev, staging e prod mudando apenas os parâmetros.",
    concept: {
      title: "💡 Por que Parâmetros e Mapeamentos?",
      body: "<strong>Parâmetros (Parameters)</strong> são entradas que o usuário fornece ao criar a pilha (ex: tipo de instância). <strong>Mapeamentos (Mappings)</strong> são dicionários fixos no modelo — usados para variar valores por região ou ambiente sem precisar de parâmetros.",
    },
    steps: [
      {
        title: "Passo 1 — Crie a nova pilha com modelo parametrizado",
        items: [
          "CloudFormation → Pilhas → Criar pilha → Com novos recursos",
          'Em "Preparar modelo", escolha <strong>Construir a partir do Infrastructure Composer</strong>',
          "Cole o modelo abaixo na aba <strong>Modelo</strong> do Composer:",
        ],
      },
    ],
    codeId: "c2",
    code: `AWSTemplateFormatVersion: '2010-09-09'
Description: TechStock - Modelo com Parameters, Mappings e Conditions (2026)

Parameters:
  Environment:
    Type: String
    Default: lab
    AllowedValues: [lab, dev, prod]
    Description: Ambiente de implantacao

  AppName:
    Type: String
    Default: techstock
    Description: Nome base da aplicacao

Mappings:
  InstanceSize:
    lab:  { EC2: t3.micro  }
    dev:  { EC2: t3.small  }
    prod: { EC2: t3.medium }

  AMIByRegion:
    us-east-1: { AL2025: ami-0c101f26f147fa7fd }
    us-west-2: { AL2025: ami-07355fe79b493752d }

Conditions:
  IsProd: !Equals [!Ref Environment, prod]

Resources:
  AppServer:
    Type: AWS::EC2::Instance
    Properties:
      # !FindInMap busca o tipo correto para o ambiente escolhido
      InstanceType: !FindInMap [InstanceSize, !Ref Environment, EC2]
      # !FindInMap busca a AMI correta para a regiao atual
      ImageId: !FindInMap [AMIByRegion, !Ref "AWS::Region", AL2025]
      IamInstanceProfile: LabInstanceProfile
      Tags:
        - Key: Name
          Value: !Sub "\${AppName}-\${Environment}-app"
        - Key: Environment
          Value: !Ref Environment
        - Key: ManagedBy
          Value: CloudFormation
        - Key: Producao
          # !If retorna o primeiro valor se IsProd=true, segundo se false
          Value: !If [IsProd, "sim", "nao"]

Outputs:
  InstanceType:
    Description: Tipo de instancia escolhido pelo Mapping
    Value: !FindInMap [InstanceSize, !Ref Environment, EC2]
  NomeCompleto:
    Description: Nome gerado pelo Sub
    Value: !Sub "\${AppName}-\${Environment}-app"
  AmbienteProducao:
    Value: !If [IsProd, "SIM - ambiente de producao", "NAO - ambiente nao-prod"]`,
    finishSteps: {
      title: "Passo 2 — Criar e observar as Saídas",
      items: [
        "No Composer: clique em <strong>Salvar</strong> e <strong>Continuar no CloudFormation</strong>.",
        "Nome da pilha: <code>techstock-parametrizado</code> → selecione <code>Environment: lab</code> → <strong>Enviar</strong>.",
        "Aguarde <code>CREATE_COMPLETE</code> → aba <strong>Saídas</strong>: observe o tipo de instância e o nome gerado.",
        "Clique em <strong>Atualizar</strong> → <strong>Substituir modelo atual</strong> → <strong>Próximo</strong>.",
        "Mude <code>Environment</code> para <code>prod</code> → avance e clique em <strong>Enviar</strong>.",
        "Na aba Saídas após o update: <code>AmbienteProducao</code> deve mostrar <strong>SIM - ambiente de producao</strong>.",
      ],
    },
    expected:
      "✅ Saídas mudam conforme o Environment: lab usa t3.micro, prod usa t3.medium (Mapping escolhe automaticamente).",
    checklist: [
      "Pilha techstock-parametrizado criada com Environment=lab",
      "Saída InstanceType mostra t3.micro (valor do Mapping para lab)",
      "Após update para prod: Saída AmbienteProducao mostra SIM",
      "Entende a diferença entre Parâmetro (entrada) e Mapeamento (dicionário)",
    ],
  },
  {
    id: "t3",
    num: "3",
    title: "Conjunto de Alterações — Veja antes de aplicar",
    tag: "ChangeSet",
    tagColor: "#14532D",
    tagBg: "#F0FDF4",
    numColor: "#fff",
    numBg: "#16A34A",
    info: "ℹ️ Conjuntos de alterações (ChangeSets) são a funcionalidade mais importante para uso seguro do CloudFormation. Eles mostram EXATAMENTE o que vai mudar antes de qualquer recurso ser afetado.",
    concept: {
      title: "💡 Por que Conjuntos de Alterações existem?",
      body: "Em produção, executar um update sem saber o impacto é perigoso. Um ChangeSet é o equivalente a um <code>git diff</code> antes do merge — você vê o que vai mudar e decide se quer prosseguir. Recursos com Substituição=True serão excluídos e recriados (possível downtime!).",
    },
    steps: [
      {
        title:
          "Passo 1 — Crie um conjunto de alterações para a pilha existente",
        items: [
          "Na pilha <code>techstock-parametrizado</code>, clique no botão <strong>Atualizar</strong>.",
          "Selecione a opção <strong>Criar um conjunto de alterações</strong>.",
          "Mantenha <strong>Usar modelo existente</strong> (isso evita ter que colar o código novamente) → <strong>Próximo</strong>.",
          "No Passo 2 (Parâmetros), mude o <code>Environment</code> de volta para <code>dev</code> → <strong>Próximo</strong> → <strong>Próximo</strong>.",
        ],
      },
      {
        title: "Passo 2 — Analise o conjunto de alterações",
        items: [
          "Na tela final, observe a seção <strong>Conjunto de alterações</strong>.",
          "Observe a coluna <strong>Ação</strong>: <code>Modify</code> (modificação), <code>Add</code> (criar) ou <code>Remove</code> (excluir).",
          "Observe a coluna <strong>Substituição</strong>: <code>True</code> significa que o recurso real será DELETADO e RECRIADO.",
        ],
      },
    ],
    hint: "📸 A tabela do Conjunto de Alterações é a informação mais valiosa. Nunca execute um update em produção sem revisá-la primeiro.",
    finishSteps: {
      title: "Passo 3 — Executar ou cancelar",
      items: [
        "Para aplicar: clique em <strong>Executar conjunto de alterações</strong> → aguarde <code>UPDATE_COMPLETE</code>.",
        "Para cancelar: clique em <strong>Excluir</strong> (a pilha volta ao estado anterior sem mudanças).",
        "Execute as mudanças e verifique se o InstanceType nas Saídas mudou para <code>t3.small</code>.",
      ],
    },
    expected:
      "✅ Conjunto de alterações executado com sucesso. Saída InstanceType agora mostra t3.small.",
    checklist: [
      "Conjunto de alterações criado (não aplicado automaticamente)",
      "Colunas Ação e Substituição analisadas antes de executar",
      "Conjunto de alterações executado: UPDATE_COMPLETE",
      "Saída InstanceType mudou para t3.small (Mapeamento de dev)",
    ],
  },
  {
    id: "t4",
    num: "4",
    title: "Detecção de Desvios — Mudanças Manuais",
    tag: "Drift",
    tagColor: "#1E40AF",
    tagBg: "#EFF6FF",
    numColor: "#fff",
    numBg: "#1E5BA8",
    info: "ℹ️ Desvio (Drift) acontece quando alguém modifica um recurso diretamente no Console AWS sem passar pelo CloudFormation. O CloudFormation perde o controle da realidade do recurso.",
    concept: {
      title: "💡 O problema do desvio",
      body: "Se você cria uma EC2 via CloudFormation e depois alguém muda manualmente as Tags ou o tipo dela no Console, o CF não sabe disso. O código diz uma coisa mas a realidade é outra. Em microsserviços e IaC, o desvio é um problema sério de governança.",
    },
    steps: [
      {
        title: "Passo 1 — Introduza um desvio manualmente",
        items: [
          "No console EC2 → Instâncias localizado a instância <code>techstock-dev-app.</code>",
          "Selecione a instância → <strong>Ações → Configurações da instância → Gerenciar tags.</strong>",
          "Adicione uma tag nova: Chave <code>ManualTag</code> Valor <code>adicionada-no-console</code> → <strong>Salvar.</strong>",
        ],
      },
      {
        title: "Passo 2 — Execute a Detecção de Desvios",
        items: [
          "No CloudFormation, selecione a pilha <code>techstock-parametrizado</code> → menu <strong>Ações da pilha</strong> → <strong>Detectar oscilações.</strong>",
          "Aguarde o status mudar para <code>DESVIADO</code> (Drifted) → clique em <strong>Visualizar detalhes da oscilação.</strong>",
          "O recurso <code>AppInstance</code> aparecerá com status <code>MODIFIED</code>. Clique em <strong>View drift details.</strong>",
        ],
      },
      {
        title: "Passo 3 — Interpretando os resultados",
        items: [
          "Observe o campo <strong>Estado esperado</strong> (o que está no código) vs o <strong>Estado atual</strong> (a realidade).",
          "Para resolver: atualize o modelo para incluir a mudança, ou remova a alteração manual da AWS.",
          "Use o <strong>Amazon Q</strong> ao lado do erro para entender como remediar via código.",
        ],
      },
    ],
    expected:
      "✅ Pilha mostra status DESVIADO. Detalhes mostram a tag manual como propriedade não esperada.",
    checklist: [
      "Tag manual adicionada diretamente na EC2 (fora do CF)",
      "Detecção de Desvios executada com sucesso",
      "Pilha mostra status DESVIADO (Drifted)",
      "Detalhes do desvio mostram a tag extra",
    ],
  },
  {
    id: "t5",
    num: "5",
    title: "Saídas Cruzadas — Modularidade",
    tag: "Nested Stacks",
    tagColor: "#5B21B6",
    tagBg: "#F5F3FF",
    numColor: "#fff",
    numBg: "#7C3AED",
    info: "ℹ️ Pilhas Aninhadas (Nested Stacks) permitem criar modularidade. Saídas cruzadas (Cross-Stack) permitem que uma pilha exporte valores para outra usar — sem hardcode de IDs.",
    concept: {
      title: "💡 Saídas e !ImportValue",
      body: "Uma pilha pode exportar um valor (Ex: SG ID) com um nome único. Outra pilha importa esse valor com <code>!ImportValue nome-do-export</code>. Isso cria dependências declaradas e impede a exclusão acidental da pilha de base.",
    },
    steps: [
      {
        title: "Passo 1 — Pilha de infraestrutura (Exporta o SG)",
        items: [
          "Crie uma nova pilha chamada <code>techstock-infra-lab</code> usando o modelo abaixo:",
        ],
      },
    ],
    codeId: "c3",
    code: `AWSTemplateFormatVersion: '2010-09-09'
Description: TechStock - Pilha de Infra (exporta Security Group) 2026

Resources:
  SGApp:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: SG Modular para o app techstock
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 80
          ToPort: 80
          CidrIp: 0.0.0.0/0

Outputs:
  SGId:
    Description: ID do SG exportado para outras pilhas
    Value: !Ref SGApp
    Export:
      Name: !Sub "\${AWS::StackName}-SharedSG"`,
    infoAfter:
      "ℹ️ Se o <code>!ImportValue</code> falhar em ambientes restritos, verifique se o nome do Export é exatamente igual ao esperado pela pilha de App.",
    stepsExtra: [
      {
        title: "Passo 2 — Pilha de aplicação (Importa o SG)",
        items: [
          "Crie a pilha <code>techstock-app-lab</code> usando o modelo abaixo:",
        ],
      },
    ],
    codeExtraId: "c4",
    codeExtra: `AWSTemplateFormatVersion: '2010-09-09'
Description: TechStock - Pilha de App (importa SG) 2026

Resources:
  AppInstance:
    Type: AWS::EC2::Instance
    Properties:
      ImageId: ami-0c101f26f147fa7fd
      InstanceType: t3.micro
      IamInstanceProfile: LabInstanceProfile
      SecurityGroupIds:
        - !ImportValue "techstock-infra-lab-SharedSG"
      Tags:
        - Key: Name
          Value: techstock-app-imported-sg`,
    finishSteps: {
      title: "Passo 3 — Teste de Dependência",
      items: [
        "Aguarde <code>CREATE_COMPLETE</code> em ambas as pilhas.",
        "Tente excluir a pilha <code>techstock-infra-lab</code>.",
        "Observe o erro <strong>Export is in use</strong> — o CloudFormation protege a infraestrutura automaticamente enquanto houver uso.",
      ],
    },
    expected:
      "✅ Pilha de App usa o SG importado. Tentativa de excluir a base falha com 'Export is in use'.",
    checklist: [
      "Pilha techstock-infra-lab criada com Export do SGId",
      "Pilha techstock-app-lab criada usando !ImportValue",
      "Tentativa de excluir infra-lab falhou por uso de export",
      "Entende que !ImportValue cria dependência protegida entre pilhas",
    ],
  },
  {
    id: "t6",
    num: "6",
    title: "Rollback e Troubleshooting",
    tag: "Rollback",
    tagColor: "#991B1B",
    tagBg: "#FEF2F2",
    numColor: "#fff",
    numBg: "#C0392B",
    info: "ℹ️ Nesta tarefa você vai intencionalmente criar uma pilha com erro para ver o rollback automático e aprender a diagnosticar falhas pelos eventos.",
    concept: {
      title: "💡 Rollback automático",
      body: 'Quando qualquer recurso falha durante a criação, o CloudFormation exclui tudo o que criou antes de falhar. A pilha volta para o estado anterior. Você NUNCA fica com recursos "metade prontos" — ou cria tudo ou reverte tudo.',
    },
    steps: [
      {
        title: "Passo 1 — Crie uma pilha com erro proposital",
        items: [
          "Tente criar a pilha <code>techstock-erro-demo</code> com o modelo abaixo (possui erro de VPC inválida):",
        ],
      },
    ],
    codeId: "c5",
    code: `AWSTemplateFormatVersion: '2010-09-09'
Description: Modelo com erro intencional para demonstrar rollback

Resources:
  SGComErro:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupName: techstock-sg-erro
      GroupDescription: "Erro 2026 ⚡"
      VpcId: vpc-invalid-id-00000

  EC2Normal:
    Type: AWS::EC2::Instance
    DependsOn: SGComErro
    Properties:
      ImageId: ami-0c101f26f147fa7fd
      InstanceType: t3.micro
      IamInstanceProfile: LabInstanceProfile`,
    finishSteps: {
      title: "Passo 2 — Diagnostique o erro pelos Eventos",
      items: [
        "Acompanhe a aba <strong>Eventos</strong>. Localize o erro <code>CREATE_FAILED</code>.",
        "Observe a coluna <strong>Motivo do status</strong>: ela mostra a causa exata do erro.",
        "A pilha deve mostrar status <code>ROLLBACK_COMPLETE</code> — as mudanças foram desfeitas.",
      ],
    },
    stepsExtra: [
      {
        title: "Passo 3 — Corrija e recrie",
        items: [
          "Exclua a pilha em <code>ROLLBACK_COMPLETE</code> antes de tentar novamente.",
          "Volte ao Composer, corrija o <code>VpcId</code> para um valor real ou remova a propriedade se for usar a VPC padrão.",
          "Recrie a pilha e aguarde <code>CREATE_COMPLETE</code>.",
        ],
      },
    ],
    expected:
      "✅ Pilha em ROLLBACK_COMPLETE após a falha. Após exclusão e correção: CREATE_COMPLETE.",
    hint: "⚠️ Uma pilha em ROLLBACK_COMPLETE não pode ser atualizada — apenas excluída. Em 2026, use o Amazon Q para explicar erros complexos instantaneamente.",
    checklist: [
      "Pilha falhou com CREATE_FAILED no recurso com erro",
      "Eventos mostram o motivo técnico da falha",
      "Pilha está em ROLLBACK_COMPLETE (nada ficou órfão)",
      "Pilha excluída e recriada com sucesso após correção",
    ],
  },
  {
    id: "t7",
    num: "7",
    title: "Limpeza Final — Ordem de Exclusão",
    tag: "Cleanup",
    tagColor: "#374151",
    tagBg: "#F1F5F9",
    numColor: "#fff",
    numBg: "#546E7A",
    info: "ℹ️ Lembre-se: pilhas excluídas removem todos os recursos, garantindo que seu ambiente de laboratório fique limpo e sem custos residuais.",
    steps: [
      {
        title: "Ordem correta para exclusão (dependências entre pilhas)",
        items: [
          "Pilha <code>techstock-app-lab</code> deve ser excluída PRIMEIRO (pois ela importa dados da infra).",
          "Pilha <code>techstock-infra-lab</code>.",
          "Pilha <code>techstock-parametrizado</code>.",
          "Pilha <code>techstock-lab-cf</code>.",
          "Confirme no console EC2 que as instâncias estão como <strong>Terminated</strong>.",
        ],
      },
    ],
    expected:
      "✅ Todas as pilhas com status DELETE_COMPLETE. Nenhuma instância ou SG visível na conta.",
    warn: "⚠️ IMPORTANTE: Sempre exclua as pilhas criadas ao final das atividades para garantir que seu laboratório fique limpo e sem custos residuais.",
    checklist: [
      "Pilha de App excluída primeiro (dependência resolvida)",
      "Todas as pilhas techstock-* excluídas com sucesso",
      "Nenhum recurso pendente visível no Console",
    ],
  },
];
