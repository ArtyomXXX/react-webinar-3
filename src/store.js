/**
 * Хранилище состояния приложения
 */

class Store {
  constructor(initState = {}) {
      this.state = initState;
      this.listeners = []; // Слушатели изменений состояния
  }

  /**
   * Подписка слушателя на изменения состояния
   * @param listener {Function} 
   * @returns {Function} Функция отписки
   */

  subscribe(listener) {
      this.listeners.push(listener);
      // Возвращается функция для удаления добавленного слушателя
      return () => {
          this.listeners = this.listeners.filter(item => item !== listener);
      }
  }

  /**
   * Выбор состояния. Если запись по ключу "code" отсутствует в сессионном хранилище, то создается такая запись, куда помещается длина списка минус единица. Будет правильно работать только в том случае, если длина первичного списока минус единица сповпадает с максимальным кодом в списке.
   * @returns {Object}
   */
  getState() {
      if (sessionStorage.getItem("code") === null)
          sessionStorage.setItem("code", parseInt(this.state.list[this.state.list.length - 1]['code']));
      return this.state;
  }
  
  /**
   * Установка состояния. Если существующий код в сессионном хранилище меньше нового когда, то новый код записывается в сессионное хранилище.
   * @param newState {Object} 
   */
  setState(newState) {
      if (parseInt(sessionStorage.getItem('code')) < newState.list[newState.list.length - 1]['code'])
          sessionStorage.setItem("code", parseInt(newState.list[newState.list.length - 1]['code']));
      this.state = newState;

      // Вызываем всех слушателей
      for (const listener of this.listeners) listener();
  }    

  /**
   * Добавление новой записи. Код для новой записи берется из сессионного хранилища и прибавляется 1, т.е. новая запись больше на 1.
   */
  addItem() {
      this.setState({
          ...this.state,
          list: [...this.state.list, {code: parseInt(sessionStorage.getItem("code")) + parseInt(1), title: 'Новая запись'}]
      })
  };

  /**
   * Удаление записи по коду
   * @param code
   */
  deleteItem(code) {
      this.setState({
          ...this.state,
          list: this.state.list.filter(item => item.code !== code)
      })
  };

  /**
   * Выделение записи по ее коду
   * @param code
   */
  selectItem(code) {
      if (sessionStorage.getItem(code) === null) {
          sessionStorage.setItem(code, 1);
      } else {
          sessionStorage.setItem(code, parseInt(sessionStorage.getItem(code)) + 1);
      }

      let selectionCounterText = " | Выделяли " + sessionStorage.getItem(code) + " раз";
          
      this.setState({            
          ...this.state,
          list: this.state.list.map(item => {
              if (item.code === code) {
                  item.selected = !item.selected;
                  let insertText = "";
                  if (item.title.search("Выделяли") > 0) {
                      insertText = item.title.substring(0, item.title.search("Выделяли")-2) + selectionCounterText;
                  } else {
                      insertText = item.title + selectionCounterText;
                  }
                  item.title = insertText;
              } else {
                  if (item.selected === true)
                      item.selected = !item.selected;
              }
              return item;
          })
      })
  }
}

export default Store;