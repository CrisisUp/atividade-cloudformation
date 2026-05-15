# RELATÓRIO FINAL DA ATIVIDADE PRÁTICA DE TERRAFORM

Este documento contém o registro passo a passo da atividade prática de Terraform, com explicações detalhadas para cada etapa executada e os respectivos prints de evidência, seguindo as diretrizes estabelecidas.

## 1. Configuração do Ambiente

### Documentação — Instalação (Imagem 1)

**Evidência:** [Imagem 13-05-2026 às 20.14.png]

- **1. Instalação de utilitários do sistema:** O comando `sudo yum install -y yum-utils` instala um conjunto de ferramentas que estendem as funcionalidades do gerenciador de pacotes padrão (YUM). O `yum-utils` é necessário para que possamos usar o comando `yum-config-manager` no próximo passo.
- **2. Configuração do Repositório Oficial:** Com `sudo yum-config-manager --add-repo ...`, estamos dizendo ao Linux para "confiar" e incluir a fonte de software oficial da **HashiCorp** na sua lista de busca. Isso garante que o Terraform baixado seja autêntico e atualizado diretamente pelo fabricante.
- **3. Instalação do Terraform:** O comando `sudo yum install -y terraform` realiza o download e a instalação física do Terraform. A flag `-y` (yes) é usada para aceitar automaticamente todos os termos e o uso de espaço em disco, agilizando o processo.
- **4. Verificação de Sucesso:** Por fim, `terraform version` é executado para confirmar que o binário está no "PATH" do sistema e funcional. Na imagem, observamos a confirmação da versão **v1.15.3**, que é a versão estável utilizada para este projeto.

### Documentação — Workspace (Imagem 2)

**Evidência:** [Imagem 13-05-2026 às 20.16.png]

- **1. Criação e Navegação de Diretório:** O comando `mkdir -p ~/techstock-tf-lab && cd ~/techstock-tf-lab` realiza duas ações em sequência: primeiro cria a pasta do projeto (caso ela não exista) e imediatamente entra nela. O uso do `~` garante que a pasta seja criada na "Home" do usuário.
- **2. Listagem Detalhada:** O comando `ls -la` lista todos os arquivos, incluindo os ocultos (que começam com ponto). Na imagem, observamos que o diretório já contém a estrutura básica de um projeto Terraform, indicando que os arquivos foram criados anteriormente ou o ambiente foi restaurado.
- **3. Anatomia dos Arquivos (.tf):** Observamos arquivos fundamentais: `provider.tf` (configuração da AWS), `main.tf` (recursos), `variables.tf` (parâmetros) e `outputs.tf` (resultados). Também notamos a pasta `.terraform`, que guarda os plugins baixados pelo comando init.
- **4. O Arquivo de Estado (State):** A presença do arquivo `terraform.tfstate` é crucial. Ele é o "banco de dados" do Terraform que rastreia tudo o que foi criado na nuvem, permitindo que o Terraform saiba o que precisa ser atualizado ou deletado no futuro.

### Documentação — Provedor (Imagem 3)

**Evidência:** [Imagem 13-05-2026 às 20.24.png]

- **1. Escrita de Arquivo via Terminal:** O comando `cat > provider.tf << 'EOF'` é uma técnica chamada **Heredoc**. Ela permite escrever múltiplas linhas de texto diretamente em um arquivo sem abrir um editor como o Nano ou Vim. Tudo o que for digitado até a palavra `EOF` será salvo no arquivo.
- **2. Requisitos de Versão:** O bloco `terraform { required_version = ">= 1.6.0" }` define uma trava de segurança. Isso garante que o código só será executado em versões modernas do Terraform, evitando incompatibilidades com recursos novos do HCL.
- **3. Definição do Provedor AWS:** Em `required_providers`, especificamos o plugin da AWS. O `source = "hashicorp/aws"` aponta para o repositório oficial, e `version = "~> 5.0"` permite que o Terraform use qualquer versão 5.x, mas não mude para a 6.0 automaticamente, o que poderia quebrar o código.
- **4. Boas Práticas de Segurança:** No bloco `provider "aws"`, definimos a região `us-east-1`. Note o comentário importante: as credenciais não estão no código. No ambiente de laboratório, o Terraform usa o perfil **LabRole** injetado automaticamente pelo CloudShell, seguindo a melhor prática de nunca expor chaves de acesso no código.

### Documentação — Recursos (Imagem 4)

**Evidência:** [Imagem 13-05-2026 às 20.26.png]

- **1. Buscas Inteligentes (Data Sources):** O bloco `data "aws_ami" "al2023"` não cria uma máquina, ele atua como uma busca no catálogo da AWS. Ele localiza automaticamente o ID da imagem **Amazon Linux 2023** mais recente, garantindo que o seu código nunca fique obsoleto devido a IDs de imagens (AMIs) que expiram.
- **2. O Grupo de Segurança (Security Group):** Definimos o `resource "aws_security_group" "lab"` para atuar como o firewall da nossa instância. A regra de `ingress` (entrada) libera especificamente a porta **80 (HTTP)** para qualquer origem (`0.0.0.0/0`), permitindo o acesso via web.
- **3. Relacionamento entre Recursos:** Esta é a parte mais poderosa: em vez de escrever IDs manuais (hardcode), usamos referências dinâmicas. Em `vpc_security_group_ids = [aws_security_group.lab.id]`, o Terraform entende que existe uma dependência. Ele garante que o Security Group será criado **antes** da instância.
- **4. Configurações Específicas do Lab:** A linha `iam_instance_profile = "LabInstanceProfile"` é obrigatória no ambiente Learner Lab. Ela anexa as permissões necessárias para que a instância EC2 funcione corretamente dentro da estrutura controlada do laboratório da AWS.

### Documentação — Variáveis e Saídas (Imagem 5)

**Evidência:** [Imagem 13-05-2026 às 20.27.png]

- **1. Parametrização Dinâmica (Variables):** A criação do arquivo `variables.tf` permite que o código seja reutilizável. Em vez de fixar o tipo da instância no `main.tf`, usamos a variável `instance_type`. Isso facilita a mudança do tamanho da máquina sem precisar editar o código principal da infraestrutura.
- **2. Validação e Governança:** O bloco `validation` é uma regra de ouro para labs. Ele garante que o usuário só possa escolher entre `t2.micro` ou `t2.small`. Se alguém tentar usar uma máquina cara (como uma `t3.large`), o Terraform interromperá a execução com a mensagem de erro personalizada definida no código.
- **3. Exposição de Dados (Outputs):** O arquivo `outputs.tf` define quais informações queremos ver no terminal após o deploy. Sem isso, teríamos que ir ao Console da AWS para descobrir o ID da instância ou do Security Group. É uma forma de "exportar" os resultados do nosso trabalho.
- **4. Confirmação da Estrutura:** O comando `ls -la` finaliza esta fase confirmando que os quatro arquivos fundamentais de um projeto Terraform profissional estão presentes no diretório. Agora, o ambiente está pronto para ser inicializado.

### Documentação — Inicialização (Imagem 6)

**Evidência:** [Imagem 13-05-2026 às 20.29.png]

- **1. O Comando de Inicialização:** O `terraform init` é o primeiro comando operacional que devemos executar. Sua função é preparar o diretório de trabalho para que o Terraform entenda as configurações e saiba com qual provedor de nuvem (Cloud Provider) ele irá interagir.
- **2. Gestão de Plugins (Providers):** Durante o init, o Terraform lê o arquivo `provider.tf` e baixa automaticamente os plugins necessários. Na imagem, vemos que ele localizou e utilizou o provedor `hashicorp/aws v5.100.0`. Esses arquivos são armazenados na pasta oculta `.terraform/`.
- **3. Backend e Lock File:** O comando também inicializa o "backend" (onde o estado é guardado) e cria/atualiza o arquivo `.terraform.lock.hcl`. Este arquivo de "trava" garante que todos os membros de uma equipe usem exatamente as mesmas versões de plugins, evitando o erro clássico de "funciona na minha máquina".
- **4. Sucesso e Próximos Passos:** A mensagem em verde **"Terraform has been successfully initialized!"** é o sinal verde para prosseguirmos. A partir deste momento, o binário do Terraform está conectado aos plugins da AWS e pronto para analisar nosso código e compará-lo com a realidade da nuvem.

## 2. Primeiro Recurso (Workflow)

### Documentação — Validação e Plano Inicial (Imagem 7)

**Evidência:** [Imagem 13-05-2026 às 20.31.png]

- **1. Validação Sintática:** O comando `terraform validate` verifica se há erros de sintaxe nos arquivos `.tf`. Ele checa blocos ausentes, nomes de variáveis inválidos e erros de tipo de dados. O **Success!** indica que o código HCL está estruturalmente correto e pronto para uso.
- **2. Padronização de Código (FMT):** O comando `terraform fmt` escaneia todos os arquivos do diretório e formata a indentação e o espaçamento para o padrão canônico da HashiCorp. Na imagem, ele retornou `main.tf`, indicando que este arquivo foi modificado para corrigir o alinhamento de espaços.
- **3. O Comando Plan e Detecção de Desvios (Drift):** O `terraform plan` é o comando mais crítico do dia a dia. Primeiro, ele realiza a fase de **Refreshing state** (lendo o estado real na AWS). Na imagem, ele detectou uma anomalia: **"Objects have changed outside of Terraform"**.
- **4. Interpretação do Plano:** O Terraform percebeu que uma instância antiga (`i-0903708d3ffe9ad14`) registrada no estado local foi deletada da AWS manualmente (fora do Terraform). Como resultado, o plano se ajustou automaticamente para **recriar** a instância (símbolo `+`) para garantir que a realidade corresponda ao código.

### Documentação — O Primeiro Apply (Imagem 8)

**Evidência:** [Imagem 13-05-2026 às 20.32.png]

- **1. Execução do Provisionamento:** O comando `terraform apply` é o momento em que a infraestrutura deixa de ser apenas código e se torna realidade na nuvem. O Terraform envia as ordens para a API da AWS para criar o Security Group e a Instância EC2 conforme planejado.
- **2. Confirmação de Segurança:** Antes de agir, o Terraform apresenta o resumo e pede o `yes`. Isso é uma trava de segurança vital para evitar que alterações indesejadas sejam aplicadas por engano em ambientes de produção.
- **3. Orquestração de Dependências:** Note que o Terraform cria primeiro o Security Group e depois a instância. Ele gerencia essa ordem automaticamente baseando-se nas referências cruzadas que fizemos no código, garantindo que o SG já exista quando a EC2 precisar dele.
- **4. Resultados do Output:** Ao final do processo, o Terraform imprime os valores que definimos no `outputs.tf`. Na imagem, vemos o ID da instância e o ID do Security Group recém-criados, facilitando nossa gestão imediata.

### Documentação — Verificação de Instalação do Nginx (Imagens 9 e 10)

**Evidência:** [Imagem 13-05-2026 às 20.34.png]
**Evidência:** [Imagem 13-05-2026 às 20.35.png]

- **1. O Script de Inicialização (User Data):** No código do `main.tf`, utilizamos o bloco `user_data` para automatizar a instalação do servidor web Nginx assim que a máquina liga. Isso prova que o Terraform não apenas cria hardware, mas também configura o software inicial.
- **2. Conectividade e Segurança:** O sucesso do acesso via navegador (mostrado na imagem) prova que o nosso Security Group está funcionando perfeitamente, permitindo tráfego na porta 80.
- **3. Idempotência em Ação:** Se rodarmos o `apply` novamente sem mudar o código, o Terraform dirá que "nada precisa ser feito". Essa capacidade de manter o estado desejado sem repetir ações desnecessárias é o que chamamos de idempotência.
- **4. Validação de Saúde (Health Check):** A página "Welcome to nginx!" é a prova definitiva de que todo o workflow (Configuração -> Init -> Plan -> Apply) foi concluído com sucesso total.

### Documentação — Gestão de Outputs (Imagem 11)

**Evidência:** [Imagem 13-05-2026 às 20.38.png]

- **1. Consulta Rápida de Dados:** O comando `terraform output` permite consultar os valores de saída a qualquer momento, sem precisar rodar um apply ou olhar o console da AWS. É extremamente útil para scripts de automação que precisam do IP ou ID de um recurso.
- **2. Extração de Valores Específicos:** Ao usar `terraform output instance_id`, o Terraform filtra apenas a informação desejada. Isso é ideal para integrar o Terraform com outras ferramentas de gerência de configuração como Ansible ou scripts Bash.
- **3. Confirmação de Identidade:** O ID exibido (`i-0d9...`) é o RG da nossa máquina na AWS. Ele confirma que o Terraform está rastreando o recurso correto e que temos acesso imediato aos seus metadados fundamentais.
- **4. Governança e Transparência:** Manter outputs bem definidos é uma boa prática de governança. Ela permite que outros membros da equipe entendam rapidamente quais são os pontos de entrada e identificadores da infraestrutura provisionada.

## 3. Evolução e Plan

### Documentação — Modificação e Plano (Imagem 12)

**Evidência:** [Imagem 13-05-2026 às 20.44.png]

- **1. Edição de Código:** Utilizamos o editor **Nano** diretamente no terminal para abrir o arquivo `main.tf` e adicionar uma nova tag ao recurso de Security Group. Esta é a forma comum de evoluir a infraestrutura: alterar o código e deixar o Terraform calcular a diferença.
- **2. O Conceito de Update In-Place:** O símbolo de til (`~`) em amarelo indica uma mudança do tipo **"updated in-place"**. Isso é uma excelente notícia em DevOps: significa que o Terraform consegue aplicar a alteração sem deletar e recriar o recurso, evitando qualquer queda (downtime) no serviço.
- **3. Adição de Metadados:** O sinal de mais (`+`) em verde dentro do bloco de tags mostra exatamente o que está sendo adicionado: a chave `Owner` com o valor `aluno-lab`. As outras 3 tags que já existiam permanecem inalteradas (hidden).
- **4. Segurança Operacional:** Ao rodar o `plan` antes do `apply`, confirmamos que apenas **1 mudança** será feita e **0 recursos serão destruídos**. Esse passo é fundamental para garantir que uma simples edição de tag não cause a destruição acidental de um banco de dados ou servidor.

### Documentação — Detecção de Replace (Imagem 13)

**Evidência:** [Imagem 13-05-2026 às 20.48.png]

- **1. Mudança Crítica: Nome do SG:** Nesta etapa, alteramos o atributo `name` do Security Group no código. Diferente de uma tag, o nome de um Security Group na AWS é um atributo **imutável**.
- **2. O Conceito de Destruição e Recriação (Replace):** Note o símbolo **-/+** (vermelho/verde). O Terraform avisa: `forces replacement`. Como a AWS não permite renomear um SG, o Terraform planeja deletar o antigo e criar um novo com o nome atualizado.
- **3. Impacto na Instância (Efeito Cascata):** Como a nossa instância EC2 depende deste Security Group, o Terraform detecta que ela também precisará ser atualizada. Ele mostra que a referência do SG mudará do ID antigo para o novo (que será conhecido apenas após o apply).
- **4. Gestão de Risco:** Este print é vital porque mostra o "perigo" oculto: uma pequena mudança de string no código pode resultar na destruição de um recurso real. O plano do Terraform é a ferramenta que salva o engenheiro de cometer esse erro em produção sem perceber.

### Documentação — Aplicando Evoluções (Imagem 14)

**Evidência:** [Imagem 13-05-2026 às 20.49.png]

- **1. Execução do Update In-Place:** Após a revisão do plano, executamos o `apply`. O Terraform inicia o processo de modificação. Na imagem, observamos a mensagem `Modifying...` para o Security Group.
- **2. Agilidade na Aplicação:** Como era um "update in-place" (apenas tags), a operação leva poucos segundos. O Terraform não precisa desligar a máquina ou mexer nas regras de firewall, apenas atualiza os metadados na API da AWS.
- **3. Confirmação de Sucesso:** A mensagem `Apply complete! Resources: 0 added, 1 changed, 0 destroyed` confirma que a alteração foi aplicada com sucesso sem efeitos colaterais.
- **4. Integridade do Estado:** Após o apply, o arquivo `terraform.tfstate` é atualizado com as novas tags. Agora, a nossa "fonte da verdade" local condiz perfeitamente com a realidade da nuvem após a evolução.

### Documentação — Visualização da Evolução (Imagem 15)

**Evidência:** [Imagem 13-05-2026 às 20.50.png]

- **1. Validação via Console/CLI:** Após o apply, utilizamos o comando `terraform state show` ou consultamos os outputs para confirmar que as novas tags estão presentes.
- **2. Organização de Ativos:** A presença da tag `Owner: aluno-lab` facilita a identificação de quem é o responsável pelo custo deste recurso no faturamento da AWS, uma prática essencial em FinOps.
- **3. Ciclo de Vida da IaC:** Este passo conclui o ciclo de evolução: **Codificação -> Planejamento -> Aplicação -> Validação**. Provamos que o Terraform é capaz de gerenciar mudanças incrementais de forma segura e previsível.
- **4. Prontidão para Auditoria:** A infraestrutura agora está documentada não apenas no código, mas também nos metadados da própria nuvem, permitindo que ferramentas de auditoria externa reconheçam o recurso corretamente.

## 4. Gestão de Estado (State)

### Documentação — Inspeção de Estado (Imagem 16)

**Evidência:** [Imagem 13-05-2026 às 20.52.png]

- **1. O "Cérebro" do Terraform:** Os comandos apresentados permitem visualizar o conteúdo do arquivo `terraform.tfstate` de forma organizada e legível. Enquanto o arquivo original é um JSON complexo, o `terraform state show` traduz essas informações para o formato HCL que já conhecemos.
- **2. Atributos Gerados pela Nuvem:** Observe que o terminal exibe dados como **ARN**, **Public IP**, **Private IP** e o ID da interface de rede (**eni**). Essas informações são capturadas diretamente da AWS após a criação do recurso e **não precisam ser escritas manualmente** pelo usuário no código. O Terraform as gerencia para você.
- **3. Mapeamento Lógico vs. Físico:** O conceito fundamental aqui é o mapeamento: o Terraform vincula o nome lógico definido no seu código (`aws_instance.lab`) ao recurso físico real que existe na infraestrutura da AWS. O State é o que permite ao Terraform saber que "aquele servidor específico na nuvem" pertence a "este bloco de código no seu arquivo".
- **4. Auditoria e Debugging:** Utilizar o `terraform state list` é a maneira mais rápida de confirmar quais recursos estão sob gestão do Terraform no momento. Já o `state show` é uma ferramenta poderosa de auditoria, permitindo verificar configurações detalhadas e metadados que a AWS atribuiu dinamicamente, facilitando a resolução de problemas e o entendimento da topologia da rede.

### Documentação — Anatomia do Arquivo JSON (Imagem 17)

**Evidência:** [Imagem 13-05-2026 às 20.53.png]

- **1. Visualização Bruta (Raw Data):** O comando `cat terraform.tfstate` revela a verdadeira face da persistência do Terraform. É um arquivo JSON que contém a versão do Terraform utilizada, o "lineage" do projeto e, o mais importante, a seção `resources`.
- **2. Metadados de Controle:** Observamos campos como `serial` e `lineage`. O `serial` é um contador que aumenta a cada alteração, servindo para o Terraform identificar se o arquivo de estado foi modificado por outro processo. O `lineage` é um ID único que garante que você não tente aplicar o estado de um projeto em outro por engano.
- **3. Estrutura de Recursos:** Cada recurso é mapeado com seu tipo, nome e o provedor associado. Dentro de `instances`, encontramos todos os atributos técnicos e seus valores atuais na nuvem. É este arquivo que o Terraform consulta sempre que você roda um `plan` para calcular o que mudou.
- **4. Importância da Proteção:** Este print ressalta por que o arquivo de estado é tão sensível: ele contém todas as informações da sua infraestrutura em texto plano, incluindo IPs privados e, dependendo da configuração, até segredos. Por isso, nunca devemos versionar este arquivo no Git.

### Documentação — Controle de Versão do Estado (Imagem 18)

**Evidência:** [Imagem 13-05-2026 às 20.54.png]

- **1. O Campo 'version':** O número `4` indica a versão do esquema do arquivo de estado. Isso é importante para a compatibilidade entre diferentes versões do binário do Terraform, garantindo que o software saiba como ler e interpretar os dados salvos.
- **2. O Campo 'terraform_version':** Registra exatamente qual versão do Terraform realizou a última alteração (neste caso, `1.15.3`). Isso ajuda em auditorias para entender qual ferramenta foi usada no deploy.
- **3. Serialização e Concorrência:** O `serial` é um contador incremental (atualmente em 7). Cada vez que o Terraform realiza uma alteração e salva o novo estado, esse número aumenta. Ele funciona como um controle de versão simplificado para garantir a integridade do estado durante operações concorrentes.
- **4. O Conceito de 'Lineage':** O `lineage` é um identificador único (UUID) gerado no nascimento do projeto. Ele nunca muda. Se você tentar aplicar um plano de um projeto A em um arquivo de estado que possui um `lineage` de um projeto B, o Terraform bloqueará a operação para evitar desastres em infraestruturas erradas.
- **5. Segurança: Nunca Edite Manualmente:** Embora seja um JSON editável, o arquivo de estado é a "fonte da verdade" do Terraform. Qualquer erro de sintaxe ou inconsistência lógica introduzida manualmente pode tornar o gerenciamento da infraestrutura impossível, exigindo recuperações complexas de backup.

### Documentação — Remoção Manual do Estado (Imagem 19)

**Evidência:** [Imagem 13-05-2026 às 20.56.png]

- **1. O Comando 'terraform state rm':** Este comando é usado para remover um recurso do arquivo de estado (`.tfstate`) sem afetar o recurso real na infraestrutura da nuvem. O Terraform simplesmente "esquece" que aquele recurso existe e que ele o gerenciava.
- **2. Remoção do Estado vs. Deleção na Nuvem:** Diferente do `terraform destroy`, que envia uma ordem para a AWS deletar o recurso, o `state rm` apenas limpa o registro local. O Security Group continua existindo e funcionando na AWS, mas o Terraform não o "enxerga" mais como parte da sua gestão atual.
- **3. Consequência no 'terraform plan':** Como o código (`.tf`) ainda contém a definição do Security Group, mas o estado diz que ele não existe, o Terraform assume que ele precisa ser criado. Por isso, o plano exibe um sinal de **mais (+)** para o recurso `aws_security_group.lab`.
- **4. Efeito cascata na Instância:** A instância EC2 (`aws_instance.lab`) depende do Security Group. Como o SG original foi removido do estado e um novo será criado, o Terraform marca a instância para atualização (**~**). Ela precisará ser alterada para se conectar ao ID do novo SG que será gerado após o apply.
- **5. Por que fazer isso?:** Remover do estado é útil quando você deseja que um recurso deixe de ser gerenciado pelo Terraform (para ser gerenciado manualmente ou por outro projeto), ou quando você pretende "reimportar" o recurso para corrigir inconsistências graves no arquivo de estado.

### Documentação — Análise do Plano Pós-Remoção (Imagem 20)

**Evidência:** [Imagem 13-05-2026 às 21.01.png]

- **1. Atributos Marcados com Adição (+):** Como o Terraform removeu o `aws_security_group.lab` do seu estado, todos os atributos definidos no código aparecem com o sinal de **+**. Para o Terraform, este é um recurso completamente novo que precisa ser criado.
- **2. Mudança nos Outputs:** O output `sg_id`, que antes exibia o ID real do Security Group, agora está marcado como **(known after apply)**. Isso ocorre porque o Terraform planeja criar um novo SG e só saberá o seu ID após a execução do comando na AWS.
- **3. O Resumo do Plano:** O resumo **"1 to add, 1 to change"** confirma a intenção: adicionar o Security Group (que o Terraform acha que não existe) e alterar a instância EC2 para apontar para este novo recurso.
- **4. A Necessidade do Comando 'Import':** Este cenário de descompasso entre o estado e a realidade é o que motiva o uso do comando `terraform import`. Veremos a seguir como dizer ao Terraform: "Ei, aquele recurso que você quer criar já existe na AWS com este ID específico, passe a gerenciá-lo novamente".

### Documentação — Importação de Recursos (Imagem 21)

**Evidência:** [Imagem 13-05-2026 às 20.59.png]

- **1. Objetivo do Procedimento:** Resolver a desincronização forçada nos passos anteriores (`state rm`). O objetivo é re-adotar um recurso que já existe fisicamente na AWS para dentro do controle do estado (`terraform.tfstate`) sem precisar recriá-lo.
- **2. O Uso do AWS CLI:** Como o Terraform "esqueceu" o recurso, não podíamos mais consultar seu ID via comandos de estado. O comando `aws ec2 describe-security-groups` foi essencial para capturar o ID real diretamente da API da AWS.
- **3. A Importância do 'Terraform Import':** O comando `import` é a ferramenta fundamental para trazer governança a recursos que foram criados manualmente via Console AWS ou que, por algum erro operacional, "fugiram" do controle do Terraform. Ele evita o erro de **ResourceAlreadyExists** ao tentar reaproveitar a infraestrutura existente.
- **4. Validação: No Changes:** A mensagem **'No changes'** após o `terraform plan` é o selo de sucesso. Ela prova que a infraestrutura real agora condiz perfeitamente com o código novamente, restaurando a integridade do ambiente de IaC.

## 5. Recursos Avançados

### Documentação — Arquivos de Variáveis (.tfvars) (Imagem 22)

**Evidência:** [Imagem 13-05-2026 às 21.01.png]

- **1. Conceito Técnico: Arquivos .tfvars:** Os arquivos `.tfvars` permitem a **separação entre a lógica (código main.tf) e os dados (configurações específicas)**. No exemplo, usamos o mesmo arquivo de definição de infraestrutura para provisionar recursos com capacidades diferentes apenas trocando o arquivo de entrada.
- **2. A Flag -var-file:** Ao utilizar `-var-file="dev.tfvars"`, instruímos o Terraform a ignorar os valores padrão (default) definidos nas variáveis e injetar os valores contidos no arquivo específico. Isso é fundamental para manter um fluxo de CI/CD limpo e organizado.
- **3. Detecção de Mudanças e Idempotência:** O Terraform identificou com precisão que a instância `i-0123456789abcdef0` precisava sofrer um **update in-place** para mudar de `t2.micro` para `t2.small` e atualizar a tag de `Environment`. Isso demonstra como o Terraform gerencia o ciclo de vida do recurso baseado nos novos parâmetros fornecidos.
- **4. Vantagem Estratégica:** Utilizar arquivos de variáveis evita o erro humano e a complexidade de passar dezenas de parâmetros manualmente via linha de comando (ex: `-var="inst=..." -var="env=..."`). Além disso, permite versionar as configurações de cada ambiente (Lab, Dev, Prod) de forma isolada e segura.

### Documentação — Tratamento de Dados Sensíveis (Imagem 23)

**Evidência:** [Imagem 13-05-2026 às 21.03.png]

- **1. O Atributo sensitive = true:** Ao marcar uma variável ou output como `sensitive = true`, o Terraform instrui seus logs e interfaces de saída (CLI) a **mascarar o valor real**. Isso evita que senhas, tokens ou chaves privadas sejam expostos acidentalmente na tela ou em sistemas de log de CI/CD (como GitHub Actions ou Jenkins).
- **2. Injeção de Valor via Variáveis de Ambiente:** O uso do prefixo `TF_VAR_` seguido do nome da variável (`TF_VAR_db_password`) é uma das formas mais seguras de passar dados sensíveis. Isso evita que o valor fique registrado no histórico do shell (se passado via `-var`) ou em arquivos de texto plano no repositório.
- **3. Proteção no Plan e Apply:** No resultado do `terraform plan`, observe que o valor não é exibido, aparecendo apenas como **(sensitive value)**. O Terraform propaga essa característica: se um recurso usa uma variável sensível, qualquer atributo derivado dela que seja exibido também será mascarado automaticamente.
- **4. Conceito Técnico: Proteção de Segredos:** A segurança em infraestrutura como código (IaC) exige que **nunca commitamos segredos no Git**. O Terraform protege o usuário na camada de visualização, mas é importante lembrar que o valor real ainda reside no arquivo `terraform.tfstate`. Por isso, a proteção do estado (usando backends remotos seguros como S3 com criptografia) é o complemento indispensável a esta funcionalidade.

### Documentação — Blocos Locals e Console Interativo (Imagem 24)

**Evidência:** [Imagem 13-05-2026 às 21.04.png]

- **1. O que são Locals?:** Os blocos `locals` (Valores Locais) funcionam como variáveis internas ou constantes. Eles servem para realizar cálculos, manipulações de strings ou processamentos que não precisam ser informados pelo usuário via `variables.tf`, mantendo o código **DRY (Don't Repeat Yourself)**.
- **2. Interpolação de Strings:** A sintaxe `"${local.app_name}-${var.environment}"` demonstra o poder do HCL. Estamos combinando um valor local com uma variável de entrada para gerar um nome padronizado que será usado em tags Name de diversos recursos (EC2, VPC, S3).
- **3. Utilidade do terraform console:** O `terraform console` é uma ferramenta indispensável para **debugar lógicas complexas**. Ele permite que o engenheiro teste funções (como `upper()`, `join()`, `lookup()`) e valide referências a recursos e variáveis em tempo real, sem a necessidade de rodar um `terraform plan` completo, o que economiza tempo valioso no desenvolvimento.
- **4. Diferença entre Variables e Locals:** Enquanto **Variables** are os "inputs" (parâmetros configuráveis pelo usuário), **Locals** are as "variáveis de processamento" (lógica interna). Se você precisa concatenar o nome do projeto com o ambiente em vários lugares, use um Local para fazer isso uma única vez e referenciá-lo onde necessário.

### Documentação — Resumo Final do Plano (Imagem 38)

**Evidência:** [Imagem 13-05-2026 às 21.02.png]

- **1. Mudança nos Outputs:** A seção **Changes to Outputs** confirma que o valor de saída `instance_type_usado` será atualizado de `"t2.micro"` para `"t2.small"`. Isso valida que a alteração da variável de entrada refletiu corretamente em toda a cadeia de processamento do Terraform, incluindo o que é exibido ao usuário após a execução.
- **2. Totalizadores do Plano:** O resumo **Plan: 0 to add, 2 to change, 0 to destroy** indica que o Terraform identificou duas modificações. Neste cenário, o Terraform contabiliza tanto a alteração no recurso físico (instância EC2) quanto ajustes em lógica de estado ou múltiplos atributos impactados, garantindo que o administrador tenha a visão exata do volume de mudanças.
- **3. Conceito Técnico: Previsibilidade:** A **Previsibilidade** é um dos pilares da Infraestrutura como Código (IaC). O Terraform permite que o administrador visualize exatamente o impacto de mudar uma variável de entrada (como o `instance_type` em `dev.tfvars`) antes de qualquer ação real ser tomada na nuvem. Isso elimina o risco de efeitos colaterais inesperados em operações críticas.
- **4. A Última Barreira de Segurança:** O resumo final do plano é a **última barreira de segurança** para o administrador de sistemas. Ele serve como um "checklist" final: se o número de recursos a serem alterados ou destruídos for diferente do esperado, o administrador pode abortar a operação. É o momento crucial de validar se a intenção definida no código condiz com a segurança e estabilidade do ambiente real.

## 6. Escalabilidade (Loops)

### Documentação — Automação e Escalabilidade com Loops (Imagem 25)

**Evidência:** [Imagem 13-05-2026 às 21.05.png]

- **1. Estrutura de Dados: map(number):** Utilizamos um mapa (`map`) chamado `app_ports` onde as chaves são os nomes das aplicações e os valores são as respectivas portas. Essa estrutura é ideal para alimentar loops, pois associa um identificador único a um valor de configuração.
- **2. O Meta-argumento for_each:** O `for_each` instrui o Terraform a iterar sobre cada par chave/valor do mapa. Ao contrário do `count` (que usa índices numéricos), o `for_each` cria recursos identificados pela chave do mapa, o que torna a remoção ou adição de itens muito mais segura e previsível.
- **3. Atributos Dinâmicos: each.key e each.value:** Dentro do bloco de recurso, acessamos os dados da iteração atual usando o objeto `each`. `each.key` retorna o nome (ex: "frontend") e `each.value` retorna a porta (ex: 80). Isso permite personalizar o nome, a descrição e as regras de firewall de forma totalmente dinâmica.
- **4. Loop 'for' em Outputs:** A sintaxe `{ for k, v in ... : k => v.id }` é uma "comprehension" do Terraform. Ela percorre todos os recursos criados pelo `for_each` e gera um novo mapa como saída, facilitando a visualização de qual ID pertence a qual aplicação.
- **5. Por que usar loops?:** O uso do `for_each` torna o código muito mais **limpo e escalável**. Em vez de copiar e colar blocos de `aws_security_group` para cada nova aplicação (violando o princípio DRY), o usuário precisa apenas adicionar uma nova linha ao mapa de variáveis. O Terraform cuidará automaticamente de criar, atualizar ou remover os recursos correspondentes.

### Documentação — Detalhamento do Plano de Loops (Imagem 26)

**Evidência:** [Imagem 13-05-2026 às 21.06.png]

- **1. Identificadores Visíveis: Chaves de Instância:** Observe como o Terraform identifica cada recurso: `aws_security_group.app_sgs["backend"]`. O valor entre colchetes é a **chave da instância**. Ao usar `for_each`, o Terraform abandona o índice numérico (0, 1, 2) em favor de nomes significativos, o que evita o "efeito dominó" caso um item seja removido do meio da lista.
- **2. Atributos Específicos e Dinâmicos:** No output do plano, é possível notar as diferenças injetadas dinamicamente: o **Nome** (sg-backend vs sg-frontend), a **Descrição** e as **Portas** (8080 vs 80) mudam perfeitamente de acordo com o mapa definido. Isso demonstra a precisão do Terraform em aplicar a lógica do `each.key` e `each.value`.
- **3. Independência no Estado (State):** Cada item no loop é tratado como um recurso independente. Se você decidir remover o "backend" do mapa, o Terraform saberá exatamente qual recurso destruir sem afetar a integridade ou causar mudanças desnecessárias nos grupos de segurança do "frontend" ou "monitoring".
- **4. Importância da Precisão no Plano:** O `terraform plan` é a última linha de defesa. Ele mostra exatamente o que será criado para cada entrada do mapa, permitindo validar se as portas e nomes estão corretos antes de qualquer alteração real na infraestrutura da AWS. Essa transparência é crucial para garantir que a automação via loops não introduza erros em larga escala.

### Documentação — Detalhamento do Plano de Loops (Imagem 27)

**Evidência:** [Imagem 13-05-2026 às 21.07.png]

- **1. Verificação de Regras Específicas:** O detalhamento confirma a aplicação correta das portas definidas no mapa: o **frontend** está configurado com a porta **80** (HTTP padrão), enquanto o **monitoring** recebeu a porta **9090** (comum em ferramentas como Prometheus). Cada recurso espelha exatamente a necessidade de sua função.
- **2. Consistência Arquitetural via Loops:** Este plano demonstra o conceito de **Consistência Arquitetural**. Ao utilizar loops, o Terraform garante que todos os Security Groups sigam rigorosamente o mesmo padrão de nomenclatura (`sg-prefixo`) e a mesma estrutura de segurança, alterando apenas os parâmetros variáveis. Isso evita que um SG seja criado com tags faltando ou regras de saída inconsistentes.
- **3. Redução Drástica de Erro Humano:** O uso de loops (`for_each`) elimina a necessidade de copiar e colar blocos de código inteiros. Em uma configuração manual, é comum esquecer de alterar uma porta ou um nome após o "copy-paste". Com loops, o desenvolvedor define a **lógica uma única vez** e apenas fornece os **dados**. Se a lógica estiver correta para um, estará correta para todos os 10, 50 ou 100 recursos gerados.
- **4. Escalabilidade e Manutenção Simplificada:** Adicionar um novo ambiente ou serviço agora é tão simples quanto adicionar uma nova linha ao mapa de variáveis. O risco de "esquecer algo" é minimizado, pois o Terraform abstrai a complexidade da criação individual, permitindo que o foco da equipe de infraestrutura seja o design e não a repetição de tarefas manuais suscetíveis a falhas.

### Documentação — Automação no Deploy (Imagem 28)

**Evidência:** [Imagem 13-05-2026 às 21.08.png]

- **1. Nova Flag: -auto-approve:** A flag `-auto-approve` instrui o Terraform a aplicar as mudanças sem solicitar a confirmação manual ('yes') do usuário. Ela pula a etapa de pausa interativa, seguindo diretamente para a criação ou modificação dos recursos conforme o plano gerado.
- **2. Resumo do Plano de Execução:** O output confirma a execução do plano identificado anteriormente: **3 to add** (referente aos três novos Security Groups configurados via loops), **0 change** e **0 destroy**. O sistema prossegue automaticamente para a fase de provisionamento na AWS.
- **3. Contexto de Uso: Pipelines de CI/CD:** Este comando é fundamental em fluxos de **Integração e Entrega Contínua (CI/CD)**. Em sistemas automatizados (como GitHub Actions, GitLab CI ou Jenkins), não existe um operador humano para digitar comandos no terminal. O uso desta flag permite que o deploy ocorra de forma fluida e autônoma.
- **4. Conceito Técnico: Deploy Não Interativo:** O **Deploy Não Interativo** agiliza o ciclo de vida do desenvolvimento, permitindo atualizações de infraestrutura em segundos. Ele transforma o processo de infraestrutura em algo previsível e repetível, removendo o "gargalo" da aprovação manual em ambientes controlados.

### Documentação — Auditoria de Log (Imagem 29)

**Evidência:** [Imagem 13-05-2026 às 21.09.png]

- **1. Atributos "Por Baixo do Capô":** Enquanto aguardamos a confirmação da AWS, o Terraform exibe os valores exatos que estão sendo enviados para a API do provedor. Isso inclui metadados, regras de rede e identificadores que definem o estado final do recurso.
- **2. Regras de Egress (Saída):** Os logs mostram uma regra de saída liberando todo o tráfego (`port 0 to 0`, `protocol -1`), o que é o padrão para permitir que as instâncias se comuniquem com a internet ou outros serviços externos livremente.
- **3. Regras de Ingress Internas:** Observamos a regra de entrada restrita ao CIDR `10.0.0.0/16`. Isso garante que os Security Groups aceitem conexões apenas de dentro da própria VPC, reforçando a segurança da arquitetura.
- **4. Conceito Técnico: Auditoria de Log:** A **Auditoria de Log** durante o deploy garante transparência total. Ao invés de ser uma "caixa preta", o Terraform permite que o engenheiro valide se o que foi codificado está realmente sendo enviado para a nuvem, facilitando o debugging e a conformidade (compliance).
- **5. Por que acompanhar os logs?:** Acompanhar esses logs ajuda a entender o progresso real e identificar possíveis gargalos. Se uma criação demora mais do que o esperado (ex: Still creating...), os logs fornecem o contexto necessário para saber qual recurso está pendente e quais dependências estão sendo resolvidas.

### Documentação — Auditoria de Log (Imagem 30)

**Evidência:** [Imagem 13-05-2026 às 21.10.png]

- **1. Foco no SG Monitoring:** Os logs detalham a criação do Security Group `monitoring`. Este recurso é vital para a infraestrutura, pois permite que as ferramentas de observabilidade coletem métricas de forma segura.
- **2. Configuração da Porta 9090:** Observamos a porta `9090` sendo configurada para o recurso `aws_security_group.app_sgs["monitoring"]`. Esta porta é comumente utilizada por serviços como o Prometheus para exposição de métricas.
- **3. Atributos Consistentes e Tags:** A aplicação das tags é uniforme. A tag `ManagedBy: Terraform` é injetada em todos os recursos do loop, garantindo que qualquer pessoa visualizando o console da AWS saiba que este recurso é gerenciado via Infraestrutura como Código (IaC).
- **4. Conceito Técnico: Mapeamento de Parâmetros:** O **Mapeamento de Parâmetros** é o processo onde o Terraform traduz um item de um mapa definido no `variables.tf` em uma regra real de firewall na nuvem. Cada chave do mapa (ex: "monitoring") dispara a criação de um recurso com as propriedades específicas associadas àquela chave.
- **5. A Importância dos Logs Repetitivos:** Embora os logs possam parecer repetitivos à medida que o Terraform processa cada item do loop, eles são a garantia visual de que cada 'chave' do seu mapa de entrada foi interpretada e processada corretamente pelo provider. Cada bloco de saída confirma que a intenção declarada no código foi transformada em ação na infraestrutura.

### Documentação — Conclusão do Deploy (Imagem 31)

**Evidência:** [Imagem 13-05-2026 às 21.11.png]

- **1. Status Final do Deploy:** A mensagem `Apply complete!` confirma que o Terraform sincronizou com sucesso o estado desejado (nosso código) com a infraestrutura real na AWS. Os **3 recursos adicionados** correspondem aos três Security Groups definidos no nosso mapa de variáveis (backend, frontend e monitoring).
- **2. Output Mapeado e Identificação:** O output `sgs_criados` demonstra a elegância do uso de loops. Em vez de termos variáveis soltas, o Terraform nos entrega um mapa claro onde a **chave** é o nome funcional do recurso e o **valor** é o ID real gerado pela AWS. Isso elimina qualquer ambiguidade sobre qual ID pertence a qual camada da aplicação.
- **3. Segurança Mantida (Sensitive Data):** Mesmo após o deploy bem-sucedido, o Terraform respeita a flag `sensitive = true`. O valor de `db_password_revelado` permanece oculto como `<sensitive>` no terminal, garantindo que segredos não sejam expostos em logs de CI/CD ou telas de operadores.
- **4. Conceito Técnico: Consolidação de Dados:** A **Consolidação de Dados** é a capacidade do Terraform de coletar atributos de múltiplos recursos criados via `for_each` e agrupá-los em uma estrutura de dados única. Isso transforma uma execução em massa em uma entrega de informações organizada e programática.
- **5. Facilidade para o Desenvolvedor:** Com este output mapeado, a vida do desenvolvedor ou do engenheiro de DevOps torna-se muito mais fácil. Agora, é trivial copiar esses IDs para configurar instâncias EC2, Load Balancers ou até mesmo referenciá-los em outros projetos Terraform usando `remote_state`. A infraestrutura deixa de ser uma "caixa preta" e passa a oferecer pontos de conexão claros e bem documentados automaticamente.

### Documentação — Inventário Final (Imagem 32)

**Evidência:** [Imagem 13-05-2026 às 21.12.png]

- **1. Inventário Final Consolidado:** A listagem revela a estrutura completa da nossa infraestrutura: **1 Instância EC2** (maquina_web), **1 Security Group fixo** (sg_fixo) e **3 Security Groups dinâmicos** criados via loop. É a prova visual de que a automação transformou poucas linhas de código em múltiplos recursos reais na nuvem.
- **2. Organização via for_each:** Observe como o Terraform organiza internamente os recursos criados com loops: `aws_security_group.sgs_dinamicos["backend"]`. O uso do índice entre colchetes (o nome da chave no nosso mapa) permite que o Terraform trate cada item do loop como um recurso independente, mesmo que compartilhem o mesmo bloco de código original.
- **3. Conceito Técnico: Inventário Gerenciado:** O `state list` é a "Fonte da Verdade". Ele mostra exatamente o que o Terraform monitora. Se alguém alterar manualmente um desses recursos no console da AWS, o Terraform detectará o **drift** (desvio) na próxima execução. Da mesma forma, se executarmos um `destroy`, serão exatamente esses itens os removidos.
- **4. Sensação de Controle e Maestria:** Ver esta lista organizada após uma configuração complexa traz uma profunda sensação de controle. A automação remove o caos da criação manual "clicando em botões" e substitui por uma hierarquia lógica, previsível e fácil de auditar. Você não apenas criou recursos; você estabeleceu um sistema de governança sobre sua infraestrutura.
- **5. Próximos Passos na Gestão:** Com o inventário sob controle, o próximo nível de maturidade é utilizar comandos como `terraform state show` para mergulhar nos detalhes de um recurso específico ou `terraform plan` para garantir que o estado atual ainda corresponde ao desejado no código, fechando o ciclo de vida do gerenciamento de configuração.

## 7. Encerramento

### Documentação — Início do Encerramento (Imagem 33)

**Evidência:** [Imagem 13-05-2026 às 21.13.png]

- **1. Objetivo do Comando:** O comando `terraform plan -destroy` é o primeiro passo para o encerramento seguro do laboratório. Seu objetivo principal é planejar a remoção total da infraestrutura que foi criada, garantindo que nenhum recurso fique "esquecido" gerando custos residuais na conta da AWS.
- **2. Detalhes Visuais do Desmonte:** Na saída do terminal, o Terraform utiliza o **símbolo de menos vermelho (-)** para indicar a remoção. Note a indicação `-> null` para cada atributo da instância EC2 (como AMI e tipo de instância). Isso mostra que esses valores deixarão de existir no estado gerenciado após a execução.
- **3. Mensagem de Alerta:** A frase `aws_instance.lab will be destroyed` é o aviso final de que o recurso principal do nosso laboratório será deletado. O plano consolida todas as dependências, mostrando que, ao destruir a instância, o Terraform também cuidará dos recursos associados listados no final do resumo.
- **4. Conceito Técnico: Plano de Destruição:** O **Plano de Destruição** funciona como um "seguro" contra deleções acidentais. Em vez de deletar imediatamente, o Terraform permite que você revise exatamente o que será removido. Em ambientes de produção, essa etapa é crítica para garantir que você não está destruindo algo essencial por engano.
- **5. Importância do .tfvars no Destroy:** O uso do parâmetro `-var-file="lab.tfvars"` mesmo no comando de destruição é fundamental. Ele garante que o Terraform utilize as mesmas definições de variáveis (como IDs de VPC ou nomes de tags) que foram usadas na criação, assegurando que o Terraform olhe para o ambiente correto e resolva as dependências de forma consistente antes de aplicar a remoção.

### Documentação — Detalhamento da Limpeza (Imagem 34)

**Evidência:** [Imagem 13-05-2026 às 21.14.png]

- **1. Fase Granular da Destruição:** Nesta fase do `terraform plan -destroy`, o Terraform detalha exatamente quais sub-configurações de um recurso serão removidas. Não se trata apenas de deletar a "caixa" (a instância EC2), mas de desmontar cada engrenagem interna que foi configurada via código.
- **2. Sub-componentes na Mira:** A saída mostra a remoção de `cpu_options` e `metadata_options`. Isso garante que configurações específicas de hardware e segurança de metadados sejam limpas do estado do Terraform, refletindo que essas definições não terão mais um recurso associado na nuvem.
- **3. O Disco Root (root_block_device):** O plano confirma a destruição do `root_block_device`. Como a opção `delete_on_termination` está como `true`, o Terraform assegura que o volume EBS principal será removido junto com a instância, evitando que volumes órfãos fiquem "soltos" na conta gerando custos desnecessários.
- **4. Alvos em Cadeia: Security Group 'backend':** O Terraform identifica o próximo alvo: o Security Group **'backend'**, que faz parte de um loop (`each.key`). Isso demonstra a inteligência do Terraform em rastrear recursos criados dinamicamente e marcá-los para destruição na ordem correta de dependência.
- **5. Conceito Técnico: Limpeza Granular:** A **Limpeza Granular** é o que diferencia o Terraform de deleções manuais. Ele garante que todos os atributos e configurações associadas sejam removidos tanto do **estado (state)** quanto da **nuvem**. Isso evita o "lixo digital" — como Security Groups sem uso, volumes EBS esquecidos ou configurações de rede órfãs — garantindo que a conta AWS retorne exatamente ao seu estado original após o desmonte.

### Documentação — Destruição do Recurso Frontend (Imagem 35)

**Evidência:** [Imagem 13-05-2026 às 21.15.png]

- **1. Destruição Planejada: Security Group Frontend:** O log detalha a remoção do recurso `aws_security_group.app_sgs["frontend"]`. Este componente é vital para a conectividade externa da aplicação, e sua marcação para destruição demonstra como o Terraform identifica cada recurso dependente durante o desmonte da infraestrutura.
- **2. Atributos Mapeados para Null:** Observamos que os atributos de rede, como a **Porta 80** (ingress) e as regras de saída total (egress), estão sendo desvinculados do estado e mapeados para `null`. Isso garante que nenhuma regra órfã permaneça na conta AWS após a conclusão do comando.
- **3. Independência de Recursos em Loops:** Mesmo tendo sido criados por um único bloco `for_each`, o Terraform trata os recursos como entidades individuais. Isso significa que a destruição do SG "frontend" é processada de forma independente dos outros (como backend ou monitoring), permitindo que a API da nuvem gerencie cada remoção com precisão.
- **4. A Importância da Clareza nos Logs:** A clareza nas mensagens do terminal é fundamental para o administrador. Saber exatamente qual parte da aplicação (frontend, backend, etc.) está sendo desativada evita erros operacionais e permite uma validação visual rápida de que o plano de destruição está seguindo a estratégia correta de encerramento do serviço.
- **5. Conceito Técnico: Ciclo de Vida Individual:** A gestão individual de recursos em loops (mesmo que definidos coletivamente no código) é uma característica poderosa do Terraform. Ela garante que mudanças ou deleções em um item do mapa não afetem a integridade dos outros, mantendo a granularidade necessária para operações complexas de infraestrutura.

### Documentação — Destruição do Recurso de Monitoramento (Imagem 36)

**Evidência:** [Imagem 13-05-2026 às 21.16.png]

- **1. Destruição Planejada: Security Group Monitoring:** O log confirma o planejamento da destruição do recurso `aws_security_group.app_sgs["monitoring"]`. Este grupo de segurança, responsável por permitir o tráfego de monitoramento (Prometheus/Grafana), é o último componente da camada de rede a ser mapeado para remoção no plano atual.
- **2. Atributos Mapeados para Null (Porta 9090):** Especificamente para o monitoramento, vemos a **Porta 9090** sendo desativada. Todas as regras de ingress e egress são marcadas como `null`, sinalizando ao provedor AWS que estas configurações devem ser removidas permanentemente.
- **3. Conceito Técnico: Encerramento de Ciclo:** O "Encerramento de Ciclo" é a fase onde o Terraform garante que a infraestrutura 'temporária' ou de laboratório seja 100% removida. Isso é vital para manter o estado limpo e, especialmente em ambientes como o **Learner Lab**, garantir que créditos não sejam consumidos desnecessariamente por recursos esquecidos.
- **4. Saúde Financeira e Organizacional:** A automação da destruição é tão crucial quanto a da criação. **Financeiramente**, evita o "desperdício de nuvem" (cloud sprawl), onde recursos ativos geram custos sem utilidade. **Organizacionalmente**, promove a higiene da infraestrutura, garantindo que o ambiente reflita exatamente o que está definido no código (IaC), eliminando riscos de segurança por portas abertas em recursos órfãos.

### Documentação — Resumo Final do Plano (Imagem 37)

**Evidência:** [Imagem 13-05-2026 às 21.17.png]

- **1. Totalizadores do Plano:** O resumo final apresenta **Plan: 0 to add, 0 to change, 5 to destroy**. Isso confirma que o Terraform identificou exatamente 5 recursos (Instância EC2 e os 4 Security Groups criados via `for_each`) que serão removidos da AWS, sem nenhuma alteração ou adição pendente.
- **2. Limpeza de Outputs (Nullification):** A imagem destaca a remoção das variáveis de saída: `ami_id`, `instance_id` e `sgs_criados` estão sendo mapeados para `null`. Isso demonstra que o Terraform não está apenas preocupado com os recursos físicos, mas também em limpar o rastro de informações do seu arquivo de estado (state).
- **3. Conceito Técnico: Encerramento Responsável:** O **Encerramento Responsável** reflete a precisão do Terraform em gerenciar o ciclo de vida completo. Ele garante que referências lógicas, metadados e outputs sejam invalidados simultaneamente à destruição dos recursos físicos. Não restam "pontas soltas" no ambiente gerenciado.
- **4. Ciclo de Vida IaC Completo:** Com a aplicação deste plano (`terraform apply`), a infraestrutura na AWS deixará de existir e o arquivo de estado ficará efetivamente vazio (ou resetado). Este é o momento final do ciclo de vida da infraestrutura como código: **Provisionamento -> Evolução -> Destruição**, garantindo conformidade e controle total de custos.
