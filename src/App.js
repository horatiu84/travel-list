import { useState } from 'react'


export default function App() {

  const [items, setItems] = useState([]);

  function handleAddItem(item) {
    // very important : in react we can't mutate the state by using items.push(item), since we'll change the initial array 
    // so we need to create a new array 
    setItems( items => [...items, item]);
  }

  function handleDeleteItem(id) {
    setItems( items => items.filter(item => item.id !== id));
  }

  function handleToggleProperty(id) {
    setItems( item => item.map(item => item.id === id ? { ...item, packed: !item.packed } : item))
  }

  function onHandleReset() {
    const confirm = window.confirm('Are you sure you want to clear the list?');
    if(confirm) setItems([]);
  }

  return (
   <div className="app">
    <Logo />
    <Form onAddItems={handleAddItem} />
    <PackingList onDeleteItem = {handleDeleteItem} onToggleItem = {handleToggleProperty} onHandleReset={onHandleReset} items = {items} />
    <Stats items = {items} />
   </div>
  );
}


function Logo() {
  return <h1>🌴 Far Away 🧳</h1>
}
function Form({onAddItems}) {

  const [description, setDescription] = useState("")
  const [quantity, setQuantity] = useState(1);
  

  function handleSubmit(e) {
    e.preventDefault();

    if (!description) return;

    const newItem = {description, quantity, packed:false, id : Date.now()};


    onAddItems(newItem);

    setDescription("");
    setQuantity(1);
  }

  return <form className="add-form" onSubmit={handleSubmit}>
    <h3>What do you need for your 😍 trip?</h3>
    <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}>
      {Array.from({length: 20}, (_, i) => i+1)
      .map(num => <option value={num} key={num}>{num}</option>)}
    </select>
    <input type="text" placeholder="Item..." 
    value={description}
    onChange={(e) => setDescription(e.target.value)} />
    <button>Add</button>
  </form>
}
function PackingList({items, onDeleteItem, onToggleItem, onHandleReset}) {
  const [sortBy, setSortBy] = useState("packed");

  let sortedItems;

  if (sortBy === 'input')  {
    sortedItems = items;
  } else if (sortBy === 'description') {
    sortedItems = items.slice().sort( (a,b) => a.description.localeCompare(b.description))
  } else {
    sortedItems  = items.slice().sort((a,b) => Number(a.packed) - Number(b.packed))
  }

  return (
    <div className="list"> 
      <ul >
        {sortedItems.map(item => <Item onDeleteItem = {onDeleteItem} onToggleItem = {onToggleItem}  item={item} key={item.id} />)}
      </ul>
      <div className='actions'>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value = 'input'>Sort by the input order</option>
          <option value = 'description'>Sort by description</option>
          <option value = 'packed'>Sort by packed status</option>
        </select>
        <button onClick={onHandleReset}>Clear list</button>
      </div>
    </div>
  ) 
}

function Item({item, onDeleteItem,onToggleItem}) {
  return (
    <li> 
      <input type='checkbox' value ={item.packed} onChange={() => onToggleItem(item.id)}/>
      <span style={item.packed ? {textDecoration: 'line-through'} : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={() =>onDeleteItem(item.id)}>❌</button>
    </li>
    
  ) 
}
function Stats({items}) {

  if (!items.length) return (
    <em>
      <p className='stats'>Start adding some items in your packing list 🚀 </p>
    </em>
  )

const numItems = items.length;
const numPacked = items.filter( item => item.packed).length;
const percentage = Math.round((numPacked / numItems) * 100);
  return <footer className="stats">
    <em>
    {percentage === 100 ? "You are ready to go ✈️" :
     `💼You have ${numItems} items on your list, and you already packed ${numPacked} (${percentage}%)`}
    </em>
  </footer>
}
