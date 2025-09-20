import { cloneTemplate } from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
  const { tableTemplate, rowTemplate, before, after } = settings;
  const root = cloneTemplate(tableTemplate);

  // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы
  before.reverse().forEach((subName) => {
    // перебираем нужный массив идентификаторов
    root[subName] = cloneTemplate(subName); // клонируем и получаем объект, сохраняем в таблице
    root.container.prepend(root[subName].container); // добавляем к таблице после (append) или до (prepend)
  });

  after.forEach((subName) => {
    // перебираем нужный массив идентификаторов
    root[subName] = cloneTemplate(subName); // клонируем и получаем объект, сохраняем в таблице
    root.container.append(root[subName].container); // добавляем к таблице после (append) или до (prepend)
  });
  // @todo: #1.3 —  обработать события и вызвать onAction()
  root.container.addEventListener("change", (event) => {
    onAction();
  });
  root.container.addEventListener("reset", (event) => {
    setTimeout(() => onAction(), 100);
  });
  root.container.addEventListener("submit", (event) => {
    event.preventDefault();
    onAction(event.submitter);
  });

  const render = (data) => {
    // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
    // вопросики с row.hasOwn
    const nextRows = data.map((item) => {
      const row = cloneTemplate(rowTemplate);

      Object.keys(item).forEach((key) => {
        if (row.elements && row.elements[key]) {
          row.elements[key].textContent = item[key];
        }
      });
      return row.container;
    });

    root.elements.rows.replaceChildren(...nextRows);
  };

  return { ...root, render };
}
