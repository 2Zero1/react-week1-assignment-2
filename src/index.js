/* eslint-disable react/react-in-jsx-scope, react/jsx-filename-extension, no-unused-vars,  */
/* @jsx createElement */

const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const operators = [
  { sign: '+', execute: (x, y) => x + y },
  { sign: '-', execute: (x, y) => x - y },
  { sign: '*', execute: (x, y) => x * y },
  { sign: '/', execute: (x, y) => x / y },
];

const calculate = (left, right, operator) => {
  const [l, r] = [Number(left), Number(right)];
  return operator.execute(l, r);
};

function createElement(tagName, props, ...children) {
  const element = document.createElement(tagName);

  Object.entries(props || {}).forEach(([key, value]) => {
    element[key.toLowerCase()] = value;
  });

  children.flat().forEach((child) => {
    if (child instanceof Node) {
      element.appendChild(child);
      return;
    }
    element.appendChild(document.createTextNode(child));
  });

  return element;
}

function render(state) {
  const handleNumClick = (prevState, num) => {
    const {
      left, right, operator,
    } = prevState;

    return operator ? {
      ...prevState,
      operator,
      left,
      right: right + num,
      display: right + num,
    } : {
      ...prevState,
      operator,
      right,
      left: left + num,
      display: left + num,
    };
  };

  const handleOpClick = (prevState, operator) => {
    const { left, right, operator: prevOperator } = prevState;

    if (right) {
      const result = calculate(left, right, prevOperator);

      return {
        result,
        left: result,
        right: '',
        display: result,
        operator,
      };
    }

    return { ...prevState, operator };
  };

  const handleResultClick = (prevState) => {
    const { left, right, operator } = prevState;

    if (!right) {
      return prevState;
    }

    const result = calculate(left, right, operator);

    return {
      result,
      left: result,
      right: '',
      operator: null,
      display: result,
    };
  };

  const element = (
    <div>
      <p>간단 계산기</p>
      <p>{state.display}</p>
      <div>
        {numbers
          .map((num) => (
            <button
              type="button"
              onClick={() => render(handleNumClick(state, num))}
            >
              {num}
            </button>
          ))}
      </div>
      <div>
        {operators
          .map((operator) => (
            <button
              type="button"
              onClick={() => render(handleOpClick(state, operator))}
            >
              {operator.sign}
            </button>
          ))}
        <button
          type="button"
          onClick={() => render(handleResultClick(state))}
        >
          =
        </button>
      </div>
    </div>
  );

  document.getElementById('app').textContent = '';
  document.getElementById('app').appendChild(element);
}

const initialState = {
  result: 0,
  left: '',
  right: '',
  operator: null,
  display: '0',
};

render(initialState);
