import React from 'react';
import {createElement} from './utils.js';
import pluralTimes from './plural'
import './styles.css';

/**
 * Приложение
 * @param store {Store} Хранилище состояния приложения
 * @returns {React.ReactElement}
 */
function App({store}) {

  const list = store.getState().list;

  function plural(number, one, few, many) {
    let result = ''
    if (number % 10 === 1) return one;
    if (number % 100 > 11 && number % 100 <= 14) {
      result = ' раз';
    } else {
  
      result = (number % 10 > 1 && number % 10 < 5) ? few : many;
    }
    return result;
  }

  return (
    <div className='App'>
      <div className='App-head'>
        <h1>Приложение на чистом JS</h1>
      </div>
      <div className='App-controls'>
        <button onClick={() => store.addItem()}>Добавить</button>
      </div>
      <div className='App-center'>
        <div className='List'>{
          list.map(item =>
            <div key={item.code} className='List-item'>
              <div className={'Item' + (item.selected ? ' Item_selected' : '')}
                   onClick={() => store.selectItem(item.code)}>
                <div className='Item-code'>{item.code}</div>
                <div className='Item-title'>{item.title}
                  {item.selectedCount ? ' | Выделяли ' + item.selectedCount + ' ' + pluralTimes(item.selectedCount, 'раз', 'раза', 'раз') : ''}
                </div>
                <div className='Item-actions'>
                  <button onClick={(ev) => {
                    ev.stopPropagation();
                    store.deleteItem(item.code)
                  }}>
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
