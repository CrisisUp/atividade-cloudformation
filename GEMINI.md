# Regras para Elaboração do Trabalho de Terraform

Este documento estabelece as diretrizes para a criação da documentação de entrega da atividade prática de Terraform no AWS Learner Lab.

## Objetivo do Trabalho

O aluno deve provar que concluiu com sucesso todas as etapas da atividade prática, utilizando os prints capturados como evidência de cada checkpoint alcançado.

## Estrutura da Entrega

A documentação deve ser organizada seguindo as 7 tarefas principais definidas no arquivo `atividade-terraform.original.html`:

1. **Configuração do Ambiente:** Setup do CloudShell e instalação do Terraform.
2. **Primeiro Recurso (Workflow):** Criação dos arquivos HCL e ciclo `init` -> `plan` -> `apply`.
3. **Evolução e Plan:** Demonstração de mudanças (update in-place vs replace).
4. **Gestão de Estado (State):** Inspeção do state, drift e import.
5. **Recursos Avançados:** Uso de variáveis, variáveis sensíveis e locals.
6. **Escalabilidade (Loops):** Implementação de `for_each` para múltiplos recursos.
7. **Encerramento:** Processo de `destroy` e limpeza do ambiente.

## Regras de Documentação por Checkpoint

Para cada seção ou checkpoint documentado, as seguintes regras devem ser seguidas:

### 1. Cabeçalho Explicativo

Cada print deve ser precedido por um cabeçalho claro informando:

- Qual checkpoint da atividade está sendo validado.
- O que o comando ou a tela apresentada prova (ex: "Instalação do Terraform concluída com sucesso").

### 2. Citação de Imagens

As imagens devem ser citadas obrigatoriamente pelo seu nome de arquivo original, entre colchetes.
Exemplo: `[Imagem 13-05-2026 às 20.14.png]`

### 3. Lógica de Navegação

A documentação deve guiar o professor através do processo, explicando a intenção por trás de cada comando executado antes de mostrar o resultado no print.

## Mapeamento de Evidências (Prints)

Os prints localizados na pasta `exerc_terraform/prints/` devem ser distribuídos de forma lógica entre as tarefas. Utilize a estrutura de pastas em `documentacao/` como referência para a sequência correta das imagens.

---
**Observação:** A clareza na explicação de como o print satisfaz o checkpoint é o critério principal de avaliação. Não basta apenas colar a imagem; é preciso contextualizá-la.
