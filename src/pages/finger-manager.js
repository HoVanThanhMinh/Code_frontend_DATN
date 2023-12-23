import { useEffect, useRef, useState } from 'react';
import styles from '../styles/finger-manager.module.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { getAllFingerPrint, updateFingerPrint } from './api/networking';
import { getDate } from './api/datetime';

const wsEnroll = new WebSocket("ws://113.161.240.83:1886/ws/sync-fingerprint/enroll");
const wsMatch = new WebSocket("ws://113.161.240.83:1886/ws/sync-fingerprint/match");

function Control() {

    const [modalUpdateShow, setModalUpdateShow] = useState(false);
    const [modalAddShow, setModalAddShow] = useState(false);
    const [listFingerPrintData, setListFingerPrintData] = useState([]);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [sex, setSex] = useState('');
    const [birthday, setBirthDay] = useState('');
    const [address, setAddress] = useState('');
    const [template, setTemplate] = useState('');

    useEffect(() => {
        getAllFingerDataFromMySql();
    }, []);

    useEffect(() => {
        wsMatch.onopen = (event) => {
            console.log('Connected Match WebSocket');
        };

        wsMatch.onmessage = function (event) {
            console.log(event.data)
        };

        wsMatch.onerror = function (event) {
            console.log(event.data);
        };

        // return () => ws.close();
    }, []);

    async function getAllFingerDataFromMySql() {
        let res = await getAllFingerPrint();
        if (res) {
            if (res.length > 0) {
                setListFingerPrintData(res);
            }
        }
    }

    function handleSyncClick(row) {
        let dataSend = {
            command: 'sync',
            id: row.id,
            template: row.template
        }
        if (wsMatch.readyState === wsMatch.OPEN) {
            wsMatch.send(JSON.stringify(dataSend));
        }
        alert('Đã gửi lệnh đồng bộ');
    }

    async function handleDeleteClick(row) {
        let dataSend = {
            command: 'delete',
            id: row.id
        }
        if (wsMatch.readyState === wsMatch.OPEN) {
            wsMatch.send(JSON.stringify(dataSend));
        }

        let data = [
            {
                name: '',
                sex: '',
                birthday: '1000-01-01',
                address: '',
                template: ''
            },
            row.id
        ]
        let res = await updateFingerPrint(data);
        if(res){
            alert('Đã gửi lệnh xóa');
            getAllFingerDataFromMySql();
        }
        else{
            alert('Thất bại');
        }
    }

    function handleEditClick(data) {
        setId(data.id);
        setName(data.name);
        setSex(data.sex);
        setBirthDay(data.birthday);
        setName(data.name);
        setAddress(data.address);
        setTemplate(data.template);
        setModalUpdateShow(true);
    }

    function ModalUpdateFingerPrint(props) {

        const [_name, _setName] = useState('');
        const [_sex, _setSex] = useState('');
        const [_birthday, _setBirthDay] = useState('1990-01-01');
        const [_address, _setAddress] = useState('');
        const [_template, _setTemplate] = useState('');

        useEffect(() => {
            _setName(props.name);
            _setSex(props.sex);
            _setBirthDay(props.birthday);
            _setAddress(props.address);
            _setTemplate(props.template);
        }, [props.name, props.sex, props.birthday, props.address, props.template]);

        useEffect(() => {
            wsEnroll.onopen = (event) => {
                console.log('Connected Enroll WebSocket');
            };

            wsEnroll.onmessage = function (event) {
                _setTemplate(event.data);
            };

            wsEnroll.onerror = function (event) {
                console.log(event.data);
            };

            // return () => ws.close();
        }, []);

        async function handleSaveModalEdit() {
            let data = [
                {
                    name: _name,
                    sex: _sex,
                    birthday: getDate(_birthday),
                    address: _address,
                    template: _template
                },
                props.id
            ]
            let res = await updateFingerPrint(data);
            if (res) {
                props.onHide();
                alert('Thành công');
                getAllFingerDataFromMySql();
            }
            else {
                alert('Thất bại');
            }
        }

        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Cập nhật vân tay
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <div className={styles.modalBody}>
                            <div className={styles.modalBodyColLeft}>
                                <div className={styles.modalBodyRow}>
                                    <span>ID</span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Id"
                                        disabled
                                        defaultValue={props.id} />
                                </div>
                                <div className={styles.modalBodyRow}>
                                    <span>Tên</span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Họ và tên"
                                        value={_name}
                                        onChange={(e) => { _setName(e.target.value) }} />
                                </div>
                                <div className={styles.modalBodyRow}>
                                    <span>Giới tính</span>
                                    <select className="form-select" defaultValue={sex} onChange={(e) => _setSex(e.target.value)}>
                                        <option value=''></option>
                                        <option value='Nam'>Nam</option>
                                        <option value='Nữ'>Nữ</option>
                                    </select>
                                </div>
                                <div className={styles.modalBodyRow}>
                                    <span>Ngày sinh</span>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={new Date(_birthday).toLocaleDateString('en-CA')}
                                        onChange={(e) => { _setBirthDay(e.target.value) }} />
                                </div>
                            </div>
                            <div className={styles.modalBodyColRight}>
                                <div className={styles.modalBodyRow}>
                                    <span>Địa chỉ</span>
                                    <textarea
                                        className={`form-control ${styles.textFieldAdd}`}
                                        type="text"
                                        value={_address}
                                        onChange={(e) => _setAddress(e.target.value)} />
                                </div>
                                <div className={styles.modalBodyRow}>
                                    <span>Fingerprint Data</span>
                                    <textarea
                                        className={`form-control ${styles.textFieldTemp}`}
                                        type="text"
                                        disabled
                                        defaultValue={_template} />
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.onHide}>Close</Button>
                    <Button variant="primary" onClick={handleSaveModalEdit}>Save</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    function ModalAddFingerPrint(props) {
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Thêm mới vân tay
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <div className={styles.modalBody}>
                            <div className={styles.modalBodyColLeft}>
                                <div className={styles.modalBodyRow}>
                                    <span>ID</span>
                                    <input type="text" className="form-control" placeholder="Id" disabled />
                                </div>
                                <div className={styles.modalBodyRow}>
                                    <span>Tên</span>
                                    <input type="text" className="form-control" placeholder="Họ và tên" />
                                </div>
                                <div className={styles.modalBodyRow}>
                                    <span>Giới tính</span>
                                    <select className="form-select">
                                        <option selected value={1}>Nam</option>
                                        <option value={2}>Nữ</option>
                                    </select>
                                </div>
                                <div className={styles.modalBodyRow}>
                                    <span>Ngày sinh</span>
                                    <input type="date" className="form-control" />
                                </div>
                            </div>
                            <div className={styles.modalBodyColRight}>
                                <div className={styles.modalBodyRow}>
                                    <span>Địa chỉ</span>
                                    <textarea className={`form-control ${styles.textFieldAdd}`} type="text" />
                                </div>
                                <div className={styles.modalBodyRow}>
                                    <span>Fingerprint Data</span>
                                    <textarea className={`form-control ${styles.textFieldTemp}`} type="text" disabled />
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.onHide}>Close</Button>
                    <Button variant="primary" onClick={props.onHide}>Save</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.panel}>
                <div className={styles.panelTitleGroup}>
                    <h4>Quản lý người dùng</h4>
                </div>
                <div className={styles.table}>
                    <table className="table table-striped table-dark table-hover">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Tên</th>
                                <th scope="col">Giới tính</th>
                                <th scope="col">Ngày sinh</th>
                                <th scope="col">Địa chỉ</th>
                                <th scope="col">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                listFingerPrintData.length > 0 ?
                                    listFingerPrintData.map((element, index) => {
                                        return (
                                            <tr key={index}>
                                                <th scope="row">{element.id}</th>
                                                <td>{element.name}</td>
                                                <td>{element.sex}</td>
                                                <td>{ new Date(element.birthday) > new Date('1000-01-01') ? new Date(element.birthday).toLocaleDateString() : ''}</td>
                                                <td>{element.address}</td>
                                                <td>
                                                    {/* <button type="button" className="btn btn-primary" onClick={() => setModalAddShow(true)}>Add</button> */}
                                                    <button type="button" className="btn btn-warning" onClick={() => handleEditClick(element)}>Edit</button>
                                                    <button type="button" className="btn btn-danger" onClick={() => handleDeleteClick(element)}>Delete</button>
                                                    <button type="button" className="btn btn-success" onClick={() => handleSyncClick(element)}>Sync</button>
                                                </td>
                                            </tr>
                                        )
                                    }) : null
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            <ModalUpdateFingerPrint
                show={modalUpdateShow}
                onHide={() => setModalUpdateShow(false)}
                id={id}
                name={name}
                sex={sex}
                birthday={birthday}
                address={address}
                template={template}
            />
            <ModalAddFingerPrint
                show={modalAddShow}
                onHide={() => setModalAddShow(false)}
            />
        </div>
    )
}

export default Control;