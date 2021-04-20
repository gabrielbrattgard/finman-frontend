import {useState} from 'react'
import Button from "./Button";

//TODO: Add proper CSS formatting in index.css
const AddItem = ({onAddItem}) => {
    const [amount, setAmount] = useState('')
    const [name, setName] = useState('')
    const [unit, setUnit] = useState('')

    //The submit method for AddItems. Checks, submits and resets the internal state.
    const addItem = (e) => {
        e.preventDefault()

        //Input checking.
        if (!amount) {
            alert('Please add an amount of items')
            return
        }

        //Passes values to AddInvoice where state is handled.
        onAddItem({amount: amount, name: name, unit: unit})

        //Resets the internal state.
        setAmount('')
        setName('')
        setUnit('')

    }

    return (
        <div className='add-form'>
            <div className='form-control'>
                <label>Amount</label>
                <input
                    type='text'
                    placeholder='Enter amount'
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <label>Product Name</label>
                <input
                    type='text'
                    placeholder='Enter Customer Address'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <label>Unit</label>
                <input
                    type='text'
                    placeholder='Enter Customer Zip Code'
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                />
            </div>
            <Button onClick={addItem} text='Add item' color='green' className='btn btn-block'/>
        </div>
    )
}

export default AddItem