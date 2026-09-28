# Manual Executivo: JactoWX Agronomic & Spraying Cockpit
*Guia Estratégico de Agronomia, Meteorologia de Precisão e Roteiro de Apresentação para C-Levels*

---

## 1. Por que este tema é Crítico para a Diretoria? (O "Business Case")

No agronegócio de grande escala (como soja, milho e algodão em Mato Grosso), **os defensivos agrícolas representam entre 25% e 35% de todo o custo de produção de uma safra**. Na Fazenda Girassol, foram aplicados **392.070 litros de calda** ao longo de **5.993 hectares acumulados** (aproximadamente 7,2 coberturas completas da fazenda).

### O Risco Financeiro do "Clima Errado":
1. **Deriva por Vento Forte (> 15 km/h)**: As gotas finas pulverizadas são arrastadas para fora do talhão. É literalmente "dinheiro voando com o vento", além do risco de contaminação de lavouras vizinhas e reservas legais.
2. **Inversão Térmica por Vento Nulo (< 3 km/h)**: Sem vento, forma-se uma camada de ar estagnada. As gotas ficam suspensas como uma névoa e não descem para a planta. Quando o vento sopra horas depois, move essa nuvem tóxica em bloco.
3. **Evaporação por Calor Excessivo (> 30°C a 32°C)**: Gotas de água evaporam antes de atingir as folhas inferiores. O fungicida ou inseticida cristaliza no ar e perde até 60% da eficácia.
4. **Lavagem por Chuva (> 1 mm a 5 mm)**: Se chover antes do produto secar e ser absorvido pela folha (período de carência de 2 a 4 horas), a água da chuva lava o defensivo para o solo. O custo da operação é **100% perdido** e a praga continuará destruindo a lavoura.

> **A Proposta de Valor do JactoWX**: Cruzar a **telemetria das máquinas Jacto** com a **previsão probabilística de alta resolução do Google WeatherNext 2** para transformar a tomada de decisão de *reativa* em *preditiva*, garantindo que cada gota de defensivo atinja o alvo com máxima eficácia.

---

## 2. Conceitos Essenciais para Você Dominar sem Medo

### A. O que são os dados do Pulverizador Jacto?
* **Talhão**: É a "quadra" ou divisão física da fazenda (ex: Talhão 11, Talhão 12).
* **Área Cadastrada vs. Área Aplicada**:
  * *Cadastrada*: O contorno oficial do talhão no papel (`828,8 ha` no total da Fazenda Girassol).
  * *Aplicada*: Onde o pulverizador realmente passou aplicando defensivo (`5.993,8 ha` acumulados).
* **Passadas com Barra Aberta (Effective Swaths)**: O sensor só registra quando os bicos de pulverização estão ligados e soltando calda. Manobras de cabeceira com a barra desligada são filtradas.
* **Taxa de Aplicação (`Dose L/ha`)**: Quantos litros de líquido são pulverizados por cada hectare de terra. Na Girassol, a média foi de **73,1 L/ha**.
* **Pressão (`PSI`)**: A força da bomba hidráulica nos bicos (média de **45,7 PSI**). Pressão muito alta gera gotas minúsculas (alto risco de deriva); pressão muito baixa gera gotas grossas que escorrem da folha.

### B. O que é o Google WeatherNext 2?
* Não é uma previsão meteorológica comum de aplicativo de celular (que dá um palpite determinístico único).
* O **WeatherNext 2** é um modelo de ponta de Inteligência Artificial do Google que roda em supercomputadores e gera **64 cenários paralelos (Ensemble)** a cada rodada, cobrindo uma grade global de **0,25° (~25 km de resolução)**.
* Em vez de dizer *"vai chover"*, ele diz: *"Entre os 64 cenários simulados para o Talhão 11, 48 cenários mostram chuva moderada a partir das 14h (75% de probabilidade), mas a manhã das 08h às 12h tem 0% de risco de chuva e vento calmo de 8 km/h"*.
* É essa inteligência que alimenta o **Planejador de 15 Dias** da aplicação.

---

## 3. As 3 Regras de Ouro da Janela de Pulverização Jacto

Para facilitar a vida dos executivos, sintetizamos todas as variáveis em **3 cores**:

| Status | Parâmetros Agronômicos | Significado Prático |
| :--- | :--- | :--- |
| **IDEAL** | • Vento: **3 a 10 km/h**<br>• Temperatura: **≤ 30 °C**<br>• Chuva 24h: **< 1,0 mm** | **Máquina no campo!** A gota penetra no dossel da planta, não evapora e não sofre deriva. Máxima eficiência biológica. |
| **ALERTA** | • Vento: **10 a 15 km/h** ou **< 3 km/h**<br>• Temperatura: **30 °C a 32 °C**<br>• Chuva 24h: **1,0 a 5,0 mm** | **Operação monitorada com ajustes.** Exige troca de pontas de pulverização para gotas médias/grossas ou uso de adjuvantes antideriva. Costuma ocorrer de manhã ou tarde. |
| **IMPRÓPRIA** | • Vento: **> 15 km/h** (deriva severa)<br>• Temperatura: **> 32 °C** (evaporação rápida)<br>• Chuva 24h: **> 5,0 mm** (lavagem da calda) | **PARAR A MÁQUINA.** Pulverizar nestas condições é queimar combustível e defensivo sem resultado agronômico. |

---

## 4. O Roteiro de Apresentação Executiva (Passo a Passo)

Abra o dashboard em `http://localhost:3000` e siga este roteiro de 5 atos:

### Ato 1: O Contexto da Fazenda Girassol (Visão Macro)
* **Onde olhar**: Nos 5 cards do topo.
* **O que falar**:
  > *"Senhores, temos aqui o Cockpit Integrado JactoWX conectado diretamente aos limites da Fazenda Girassol em Mato Grosso. Estamos monitorando 6 talhões estratégicos somando **828,8 hectares**.*
  > *Ao longo da safra 2025/2026, os equipamentos Jacto cobriram **5.993 hectares**, o que significa que cada talhão recebeu em média **7,2 aplicações completas** de proteção vegetal, consumindo **392 mil litros de calda** a uma dose média calibrada de **73 L/ha**."*

### Ato 2: O Mapa Geoespacial no Google Maps (Aba "Mapa & Playback")
* **Onde olhar**: No mapa com imagem de satélite e no botão de *Playback Safra*.
* **O que falar**:
  > *"Integrado ao Google Maps de alta resolução, estamos vendo os 6 talhões desenhados com precisão geodésica WGS84.*
  > *O grande diferencial: quando eu clico em 'Playback Safra' ou arrasto a linha do tempo, o mapa desenha exatamente as **passadas com barra aberta** em ciano. Não é estimativa: é onde o bico do pulverizador estava aplicando defensivo.*
  > *Vejam no card superior direito do mapa: para cada dia da safra, nós cruzamos a operação com o modelo WeatherNext 2 do Google, indicando a temperatura daquele dia, a velocidade do vento e o total de horas livres para trabalhar."*

### Ato 3: A Auditoria de Conformidade Climática da Safra
* **Onde olhar**: No card "Auditoria Meteorológica" (KPI 4) e na aba "Operações".
* **O que falar**:
  > *"Ao auditarmos as 110 operações da safra contra o WeatherNext 2, identificamos um dado crucial de negócio:*
  > * **63% das aplicações** ocorreram em janelas ideais ou sob alerta de chuva leve de verão.*
  > *Porém, **37 aplicações** ocorreram em dias em que o acumulado de 24h teve chuva acima de 5 mm.*
  > *Mas vejam que interessante: a nossa métrica de **horas estimadas de janela ideal** revela que, mesmo nesses dias de chuva de verão em Mato Grosso, havia uma janela segura de 4 a 8 horas na madrugada ou pela manhã antes da chuva da tarde. O JactoWX permite que o gestor capture exatamente essas janelas sem parar a fazenda."*

### Ato 4: O Futuro — Planejamento Operacional de 15 Dias (Aba "Previsão 15 Dias")
* **Onde olhar**: Na aba "Previsão 15 Dias", mostrando o gráfico ECharts e a matriz por talhão.
* **O que falar**:
  > *"Agora a virada de chave do produto: saímos do espelho retrovisor e olhamos para a frente.*
  > *Aqui temos os próximos 15 dias previstos pelos 64 membros de ensemble do WeatherNext 2.*
  > *Vejam no gráfico: entre 29 de setembro e 12 de outubro, o sistema já avisa a diretoria onde e quando pulverizar.*
  > *Por exemplo: no dia **30 de setembro**, todos os talhões estão em **🟢 IDEAL**, com **18 horas livres de pulverização**, vento de 8,7 km/h e temperatura amena de 27°C. É a data de ouro para entrar com fungicida sistêmico.*
  > *Já no dia **02 e 05 de outubro**, o sistema sinaliza **🔴 IMPRÓPRIA** por previsão de pancadas de chuva superiores a 5 mm. O agrônomo não perde viagem, evita atolamento de maquinário e não joga defensivo fora."*

### Ato 5: O Drill-Down e Detalhes por Talhão (Aba "Operações" e "Gráficos & KPIs")
* **O que fazer**: Clicar em qualquer linha da tabela para abrir o **Painel Lateral de Investigação**.
* **O que falar**:
  > *"Qualquer diretor ou auditor pode auditar cada aplicação individualmente. Clicando no talhão, vemos a dose real, a pressão em PSI, as horas de janela daquele dia e a conformidade agronômica.*
  > *Na aba de gráficos, correlacionamos a calibração da máquina (Dose x Pressão) com as condições de vento para garantir que as pontas de pulverização estão trabalhando na faixa correta."*

---

## 5. Perguntas Frequentes & Validação Técnica (FAQ Executivo)

#### P1: *"Por que usar o WeatherNext 2 do Google em vez da estação meteorológica física da fazenda?"*
> **Sua resposta**: *"Eles são complementares. A estação física só mede o passado (o que já choveu ou o vento que está soprando agora). O WeatherNext 2 olha para a **frente**, com 64 simulações de ensemble para 15 dias, permitindo planejar a compra de calda, o abastecimento e a escala dos operadores com dias de antecedência."*

#### P2: *"Por que o Talhão 11 tem área cadastrada de 138 ha, mas num dia aplicou 74 ha e no outro 122 ha?"*
> **Sua resposta**: *"Excelente ponto. Nosso arquivo de pulverização considera apenas o **trabalho efetivo com barra aberta**. Em alguns dias a máquina fez apenas meia área ou uma aplicação em reboleira (foco de praga específico), e em outros dias cobriu quase a totalidade do talhão. O dashboard mede o trabalho real realizado pelo pulverizador, e não apenas o perímetro teórico."*

#### P3: *"Por que a maioria dos dias aparece como 'ALERTA'?"*
> **Sua resposta**: *"Mato Grosso no período chuvoso (outubro a março) tem pancadas de chuva quase diárias no fim da tarde. Por isso, a classificação diária indica 'Alerta de Chuva 1 a 5 mm'. Porém, o nosso cockpit quebra o dia em **turnos de 6 horas** e calcula as **Horas de Janela Ideal**. O operador consegue ver que das 06h às 12h o campo está limpo para trabalhar com segurança antes da chuva chegar."*

#### P4: *"De onde vêm as coordenadas dos talhões?"*
> **Sua resposta**: *"Vêm dos arquivos Shapefiles cadastrais originais da Fazenda Girassol, convertidos para o padrão geodésico WGS 84 e processados na coluna nativa GEOGRAPHY do BigQuery. Isso garante total interoperabilidade com o Google Maps e ferramentas GIS."*

---

## 6. Números-Chave da Fazenda Girassol

* **Fazenda**: Fazenda Girassol (Itiquira / Rondonópolis - MT)
* **Talhões**: 6 talhões (`11`, `12`, `27`, `28`, `44`, `45`)
* **Área Total**: `828,84 ha`
* **Área Pulverizada Acumulada**: `5.993,84 ha` (~7,2 vezes a fazenda toda)
* **Volume Aplicado**: `392.070 Litros`
* **Taxa Média de Calda**: `73,1 L/ha`
* **Pressão Média de Trabalho**: `45,7 PSI`
* **Melhor Próxima Janela**: `30/09/2026` (18 horas ideais livres)
* **Faixa Segura de Vento**: `3 a 10 km/h`
* **Limite Crítico de Calor**: `30 °C` (máximo `32 °C`)
