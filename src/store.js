/**
 * Хранилище состояния приложения
 */
class Store {
    constructor(initState = {}) {
      this.state = initState;
      this.listeners = []; // Слушатели изменений состояния
      this.newCode = this.id();
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
     * Выбор состояния
     * @returns {Object}
     */
    getState() {
      return this.state;
    }
  
    /**
     * Установка состояния
     * @param newState {Object}
     */
    setState(newState) {
      this.state = newState;
      // Вызываем всех слушателей
      for (const listener of this.listeners) listener();
    }
  
    /**
     * Генератор id для записей с хранением значения в замыкании
     */
    id() {
      let counter = this.state.list[this.state.list.length - 1].code;
      return () => {
        return ++counter;
      }
  
    }
    /**
     * Добавление новой записи
     */
    addItem() {
      this.setState({
        ...this.state,
        list: [...this.state.list, { code: this.newCode(), title: 'Новая запись' }]
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
     * Выделение записи по коду
     * @param code
     */
    selectItem(code) {
      this.setState({
        ...this.state,
        list: this.state.list.map(item => {
          if (item.code === code) {
            item.selected = !item.selected;
            if (item.selected) item.selectedCount = item.selectedCount + 1 || 1;
          } else {
            item.selected = false;
          }
          return item;
        })
      })
    }
  }
  
  export default Store;