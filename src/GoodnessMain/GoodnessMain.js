import React, { useState } from 'react';
// importing nanoid to auto generate id for contacts
import { nanoid } from 'nanoid'
// all bootstrap components imports
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
// all react-icons imports
import { BsThreeDotsVertical, BsPlusCircleFill } from 'react-icons/bs';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
// regular css import
import './goodnessMain.css'

const GoodnessMain = () => {
  // state to handle all modal functions
  const [show, setShow] = useState(false);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');

  // function to close the modal
  const handleClose = () => setShow(false);

  // state that handles contact data
  const [dummyData, setDummyData] = useState(JSON.parse(localStorage.getItem('contactList')))

  // state that handles search
  const [search, setSearch] = useState('')
  // state to handle modal switch between creating and edit mode
  const [modalSwitch, setModalSwitch] = useState(false)

  // function to empty modal fields 
  function emptyFields() {
    setName('')
    setEmail('')
    setNumber('')
  }

  // function to edit contact
  function handleContactEdit(e) {
    e.preventDefault()
    const index = dummyData.filter((item) => item.id !== id)
    localStorage.setItem('contactList', JSON.stringify([...index, { id, name, email, number }]))
    setDummyData([...index, { id, name, email, number }])
    console.log(index)
    emptyFields()
    handleClose()
  }

  // function to create new contacts
  function handleContactCreate(e) {
    e.preventDefault()
    if (!dummyData) {
      localStorage.setItem('contactList', JSON.stringify([{ id: nanoid(), name, email, number }]))
      setDummyData(JSON.parse(localStorage.getItem('contactList')))
    } else {
      localStorage.setItem('contactList', JSON.stringify([...dummyData, { id: nanoid(), name, email, number }]))
      setDummyData(JSON.parse(localStorage.getItem('contactList')))
    }
    emptyFields()
    handleClose()
  }


  // function to delete contact
  function handleContactDelete(cid) {
    const index = dummyData.filter((item) => item.id !== cid)
    setDummyData([...index])
    localStorage.setItem('contactList', JSON.stringify([...index]))
    // window.location.reload()

  }

  // function to handle modal data change
  function handleCreateShow() {
    setModalSwitch(false)
    setShow(true)
  }

  // function to display edit modal and populate the modal with the edit data
  function handleEditShow(data) {
    setModalSwitch(true)
    setName(data.name)
    setEmail(data.email)
    setNumber(data.number)
    setId(data.id)
    setShow(true)
  }

  return (
    <>
      <div className="goodnessmain-container">
        <div className="goodness-main-upper">
          <h2>Phone</h2>
          <p>{dummyData ? dummyData.length : 0} contacts</p>
        </div>
        <div className="goodness-toolbox-div">
          <input type="text" placeholder='Search name or number' value={search} onChange={(e) => setSearch(e.target.value)} /> <span onClick={handleCreateShow}><BsPlusCircleFill /></span>
        </div>
        <div className="goodness-contact-list-wrapper">

          {dummyData?.filter(
            (card) =>
              card.name.toLowerCase().includes(search.toLowerCase()) ||
              card.number.includes(search)
          ).map((card) => {
            return <div key={card.id} className="goodness-contact-list-item">
              <span>{card.name}</span>
              <span>
                <Dropdown>
                  <Dropdown.Toggle >
                    <BsThreeDotsVertical />
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleEditShow(card)}><AiFillEdit /> Edit</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleContactDelete(card.id)}><AiFillDelete /> Delete</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </span>
            </div>
          })}


        </div>
      </div>

      {/* Reusable modal for both edit and adding contact */}
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered={true}
        contentClassName='goodness-form-modal-main'
      >
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <div className="goodness-form-modal-container">
            <form onSubmit={modalSwitch ? handleContactEdit : handleContactCreate}>
              <h4>{modalSwitch ? "Edit Contact" : "Create new contact"}</h4>
              <div className="goodness-form-modal-item">
                <label htmlFor="name">Name</label>
                <input type="text" id='name' name='name' value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="goodness-form-modal-item">
                <label htmlFor="email">Email</label>
                <input type="email" id='email' name='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="goodness-form-modal-item">
                <label htmlFor="number">Phone</label>
                <input type="number" id='number' name='number' value={number} onChange={(e) => setNumber(e.target.value)} required />
              </div>
              <div className="goodness-form-modal-item">
                <button>Save</button>
              </div>
            </form>
          </div>
        </Modal.Body>

      </Modal>

    </>
  )
}

export default GoodnessMain