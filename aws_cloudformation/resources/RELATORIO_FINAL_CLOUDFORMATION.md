# Relatório de Atividade: Infraestrutura como Código com AWS CloudFormation

**Candidato:** Cristiano Batista Pessoa
**Data:** 15 de Maio de 2024
**Tecnologias:** AWS CloudFormation, YAML, AWS Console

---

## 1. Resumo da Atividade

Esta atividade consistiu na implementação e gestão de infraestrutura na AWS utilizando o serviço **CloudFormation**. O foco foi o aprendizado prático do ciclo de vida de pilhas (stacks), desde a criação via Designer, parametrização com Mappings, uso de ChangeSets para segurança, detecção de desvios (Drift), modularização com exportação de valores e tratamento de erros com Rollback.

---

## 2. Detalhamento das Tarefas e Evidências

### Tarefa 1: Primeira Stack — EC2 pelo Console

- **Descrição:** Criação de uma instância EC2 básica utilizando um template YAML inserido diretamente no CloudFormation Designer.
- **Evidência:** Stack `techstock-lab-cf` criada com sucesso. Os Outputs revelam a instância `i-0ddc2e121522d7657` e o IP `172.31.44.19`.
- **Referência:** `[PDF - Seção 1: Prints 1, 2, 3 e 4]`

### Tarefa 2: Parameters e Mappings — Infra Parametrizada

- **Descrição:** Implementação de lógica condicional e dicionários de valores (Mappings) para alternar entre ambientes (lab, dev, prod).
- **Evidência:** Stack `techstock-parametrizado` operando em ambiente de desenvolvimento (`dev`), selecionando automaticamente o tipo `t2.small` conforme mapeado.
- **Referência:** `[PDF - Seção 2: Prints 1, 2 e 3]`

### Tarefa 3: ChangeSet — Veja Antes de Aplicar

- **Descrição:** Utilização de Conjuntos de Alterações para prever o impacto de mudanças antes da execução.
- **Evidência:** Registro de ChangeSet mostrando a modificação (`Modify`) do recurso `AppInstance` com substituição condicional.
- **Referência:** `[PDF - Seção 2: Print 4]`

### Tarefa 4: Drift Detection — Detectando Mudanças Manuais

- **Descrição:** Identificação de alterações feitas manualmente no Console que divergem do código (IaC).
- **Evidência:** O CloudFormation detectou o status `DRIFTED` após a adição manual da tag `ManualTag`. O detalhamento mostra a discrepância entre o estado esperado e o atual.
- **Referência:** `[PDF - Seção 2: Print 5]`

### Tarefa 5: Nested Stacks e Outputs Cross-Stack

- **Descrição:** Criação de dependências entre stacks através da exportação (`Export`) e importação (`!ImportValue`) de valores, como IDs de Security Groups.
- **Evidência:** Stack `techstock-infra-lab` exportando o `SGId`, consumido pela stack `techstock-app-lab`.
- **Referência:** `[PDF - Seção 2: Prints 6, 7 e 8]`

### Tarefa 6: Rollback e Troubleshooting

- **Descrição:** Simulação de erro proposital (caractere inválido e VPC inexistente) para observar o mecanismo de proteção do CloudFormation.
- **Evidência:** Stack `techstock-erro-demo` atingiu o estado `ROLLBACK_COMPLETE`, garantindo que nenhum recurso órfão permanecesse após a falha.
- **Referência:** `[PDF - Seção 2: Print 9]`

### Tarefa 7: Limpeza — Deletando Todas as Stacks

- **Descrição:** Desprovisionamento ordenado dos recursos para evitar custos e manter a governança.
- **Evidência:** Logs de `DELETE_COMPLETE` para todas as stacks e instâncias EC2 em estado `Terminated`.
- **Referência:** `[PDF - Seção 2: Prints 10 a 17]`

---

## 3. Conclusão

A atividade demonstrou a robustez do CloudFormation como ferramenta de IaC. Todos os checkpoints foram validados com evidências visuais no PDF, comprovando o domínio sobre a criação, atualização, segurança e limpeza de recursos na AWS de forma automatizada.
