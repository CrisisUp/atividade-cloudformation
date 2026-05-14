/**
 * Renderiza as tarefas dinamicamente a partir de TASKS_DATA
 */
function renderTasks() {
  const container = document.getElementById('tasks-container');
  if (!container || !TASKS_DATA) return;

  const html = TASKS_DATA.map(task => `
    <details class="task" id="${task.id}" ${task.open ? 'open' : ''}>
      <summary class="task-hdr">
        <div class="task-num" style="background:${task.numBg}; color:${task.numColor}">${task.num}</div>
        <div class="task-title">${task.title}</div>
        <span class="task-tag" style="background:${task.tagBg}; color:${task.tagColor}">${task.tag}</span>
      </summary>
      <div class="task-body">
        ${task.info ? `<div class="info">${task.info}</div>` : ''}
        ${task.concept ? `
          <article class="concept">
            <div class="concept-title">${task.concept.title}</div>
            <div class="concept-body">${task.concept.body}</div>
          </article>
        ` : ''}
        
        ${task.steps ? task.steps.map(step => `
          <section class="step-box">
            <h4>${step.title}</h4>
            <ol class="console-steps">
              ${step.items.map(item => `<li>${item}</li>`).join('')}
            </ol>
          </section>
        `).join('') : ''}

        ${task.code ? `
          <div class="cloudshell-box">
            <div class="cloudshell-label">Terminal / Editor</div>
            <div style="position:relative">
              <pre id="${task.codeId}">${task.code}</pre>
              <button class="copy-btn" onclick="cp('${task.codeId}', this)">Copiar</button>
            </div>
          </div>
        ` : ''}

        ${task.infoAfter ? `<div class="info">${task.infoAfter}</div>` : ''}

        ${task.stepsExtra ? task.stepsExtra.map(step => `
          <section class="step-box">
            <h4>${step.title}</h4>
            <ol class="console-steps">
              ${step.items.map(item => `<li>${item}</li>`).join('')}
            </ol>
          </section>
        `).join('') : ''}

        ${task.codeExtra ? `
          <div class="cloudshell-box">
            <div class="cloudshell-label">Terminal / Editor</div>
            <div style="position:relative">
              <pre id="${task.codeExtraId}">${task.codeExtra}</pre>
              <button class="copy-btn" onclick="cp('${task.codeExtraId}', this)">Copiar</button>
            </div>
          </div>
        ` : ''}

        ${task.hint ? `<p class="screenshot-hint">${task.hint}</p>` : ''}

        ${task.finishSteps ? `
          <section class="step-box">
            <h4>${task.finishSteps.title}</h4>
            <ol class="console-steps">
              ${task.finishSteps.items.map(item => `<li>${item}</li>`).join('')}
            </ol>
          </section>
        ` : ''}

        ${task.expected ? `<div class="exp">${task.expected}</div>` : ''}
        ${task.warn ? `<div class="warn">${task.warn}</div>` : ''}

        <div class="checks">
          <div class="checks-label">Checklist de Validação</div>
          ${task.checklist.map(item => `
            <label class="check-item">
              <input type="checkbox" onchange="updateProg()"> 
              <span>${item}</span>
            </label>
          `).join('')}
        </div>
      </div>
    </details>
  `).join('');

  container.innerHTML = html;
}

/**
 * Calcula e atualiza a barra de progresso visual
 */
function updateProg() {
  const checkboxes = document.querySelectorAll('.check-item input[type="checkbox"]');
  const total = checkboxes.length;
  let checked = 0;

  checkboxes.forEach(input => {
    const parent = input.closest('.check-item');
    if (input.checked) {
      checked++;
      if (parent) parent.classList.add('checked');
    } else {
      if (parent) parent.classList.remove('checked');
    }
  });

  const pct = total ? Math.round((checked / total) * 100) : 0;

  const progressBar = document.getElementById('pf');
  const progressLabel = document.getElementById('pl');
  const congratsSection = document.getElementById('congrats');

  if (progressBar) progressBar.style.width = pct + '%';
  if (progressLabel) progressLabel.textContent = `${pct}% concluído (${checked}/${total})`;

  if (congratsSection) {
    if (pct === 100) {
      congratsSection.style.display = 'block';
    } else {
      congratsSection.style.display = 'none';
    }
  }
}

/**
 * Copia o conteúdo para a área de transferência
 */
function cp(id, btn) {
  const el = document.getElementById(id);
  if (!el) return;

  navigator.clipboard.writeText(el.textContent).then(() => {
    if (btn) {
      const originalText = btn.textContent;
      btn.textContent = 'OK!';
      setTimeout(() => { btn.textContent = originalText; }, 1500);
    }
  }).catch(err => console.error('Falha ao copiar: ', err));
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  renderTasks(); 
  updateProg(); 
});
