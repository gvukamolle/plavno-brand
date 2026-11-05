const views = [...document.querySelectorAll('[data-view]')];
const panels = [...document.querySelectorAll('.app-panel')];

function showView(view) {
  views.forEach(button => {
    const selected = button.dataset.view === view;
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  panels.forEach(panel => { panel.hidden = panel.id !== 'panel-' + view; });
}

function wireTabs(buttons, activate, orientation = 'horizontal') {
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => activate(button));
    button.addEventListener('keydown', event => {
      const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';
      const previousKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
      let next;
      if (event.key === nextKey) next = (index + 1) % buttons.length;
      else if (event.key === previousKey) next = (index - 1 + buttons.length) % buttons.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = buttons.length - 1;
      else return;
      event.preventDefault();
      activate(buttons[next]);
      buttons[next].focus();
    });
  });
}
wireTabs(views, button => showView(button.dataset.view), 'vertical');
document.querySelectorAll('[data-open-view]').forEach(button => {
  button.addEventListener('click', () => showView(button.dataset.openView));
});
document.querySelectorAll('[data-jump-view]').forEach(button => {
  button.addEventListener('click', () => {
    showView(button.dataset.jumpView);
    document.getElementById('product').scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start'});
    views.find(tab => tab.dataset.view === button.dataset.jumpView).focus({preventScroll: true});
  });
});
const recordTabs = [...document.querySelectorAll('[data-record]')];
wireTabs(recordTabs, button => {
  const selected = button.dataset.record;
  recordTabs.forEach(tab => {
    const active = tab === button;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  document.getElementById('record-summary').hidden = selected !== 'summary';
  document.getElementById('record-transcript').hidden = selected !== 'transcript';
});
const examples = {
  meeting: {question: 'Что решили на встрече по новому разделу?', answer: ['Команда решила начать с трёх сценариев: создание документа, совместное обсуждение и поиск.', 'Следующие шаги — подготовить макет, собрать вопросы и вернуться к ним на следующей встрече.']},
  knowledge: {question: 'Где искать рабочие материалы команды?', answer: ['Документы и заметки команды собраны в пространстве Студии. Рабочие договорённости описаны в документе «Как работаем с документами».', 'К записи обсуждения и его итогам можно вернуться в Спиче.']},
  next: {question: 'Что подготовить к следующей встрече?', answer: ['Подготовьте первый вариант макета нового раздела и список вопросов по работе с документами.', 'На следующем обсуждении команда планирует пройти основные сценарии и уточнить поиск по материалам.']}
};
document.querySelectorAll('[data-question]').forEach(button => {
  button.addEventListener('click', () => {
    const key = button.dataset.question;
    const example = examples[key];
    const source = document.getElementById('demo-source');
    source.dataset.openView = key === 'knowledge' ? 'studio' : 'speech';
    source.querySelector('span').textContent = key === 'knowledge' ? 'Как работаем с документами' : 'Подготовка нового раздела';
    source.querySelector('use').setAttribute('href', key === 'knowledge' ? '#i-note' : '#i-mic');
    document.getElementById('demo-question').textContent = example.question;
    document.getElementById('demo-answer').replaceChildren(...example.answer.map(text => {
      const paragraph = document.createElement('p'); paragraph.textContent = text; return paragraph;
    }));
  });
});
const documents = {
  process: ['Как работаем с документами', 'Договорённости команды — в одном месте.', 'Сохраняем контекст', 'Важные решения и рабочие материалы собираем в пространстве команды. К документу можно вернуться после обсуждения и продолжить работу.', 'Делаем следующий шаг', 'По итогам встречи фиксируем договорённости, открытые вопросы и дальнейшие действия.'],
  meeting: ['Итоги продуктовой встречи', 'Решения по подготовке нового раздела.', 'С чего начинаем', 'Основные сценарии: создание документа, совместное обсуждение и поиск по материалам команды.', 'О чём договорились', 'Подготовить макет и собрать вопросы к следующему обсуждению.'],
  plan: ['План следующего обсуждения', 'Материалы, которые помогут продолжить работу.', 'Пройти основной сценарий', 'Посмотреть первый вариант макета и обсудить путь от создания документа до совместной работы.', 'Собрать вопросы', 'Уточнить поиск, навигацию и доступ к рабочим материалам.']
};
document.querySelectorAll('[data-document]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-document]').forEach(b => b.classList.toggle('doc-selected', b === button));
    const data = documents[button.dataset.document];
    const target = document.getElementById('document-content');
    const nodes = [];
    ['h2', 'p', 'h3', 'p', 'h3', 'p'].forEach((tag, index) => {
      const node = document.createElement(tag); node.textContent = data[index];
      if (index === 1) node.className = 'doc-intro'; nodes.push(node);
    });
    target.replaceChildren(...nodes);
  });
});
const messages = {
  meeting: ['Материалы к обсуждению', ['Коллеги, подготовили первый вариант макета нового раздела.', 'На следующей встрече предлагаем пройти основной сценарий, обсудить поиск и собрать вопросы.', 'Итоги предыдущего обсуждения уже есть в Спиче.']],
  notes: ['Рабочие договорённости', ['Обновили документ о работе с материалами команды.', 'В пространстве Студии собраны решения, заметки и открытые вопросы.', 'Предлагаем дополнить документ по результатам следующего обсуждения.']]
};
document.querySelectorAll('[data-mail]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-mail]').forEach(b => b.classList.toggle('mail-selected', b === button));
    const [title, paragraphs] = messages[button.dataset.mail];
    document.getElementById('mail-title').textContent = title;
    document.querySelector('.mail-sender').textContent = button.querySelector('strong').textContent;
    document.getElementById('mail-body').replaceChildren(...paragraphs.map(text => {
      const p = document.createElement('p'); p.textContent = text; return p;
    }));
  });
});
const heights = [7,12,19,10,24,35,23,40,17,29,48,31,21,39,25,14,33,50,28,19,41,27,18,34,45,31,20,11,24,37,47,32,23,15,29,41,26,18,34,22,12,24,36,19,10,17,28,19,11,7];
const waveform = document.querySelector('.waveform');
heights.forEach(height => { const bar = document.createElement('i'); bar.style.height = height + 'px'; waveform.appendChild(bar); });
