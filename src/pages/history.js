import { useEffect, useState } from 'react';
import styles from '../styles/history.module.css';
import { addHistory, filterHistory, getAllHistory, getFingerPrintById } from './api/networking';
import { getDate, getTimeFromMySql } from './api/datetime';
import { getTimeToMySql } from './api/datetime';

const wsMatch = new WebSocket("ws://113.161.240.83:1886/ws/sync-fingerprint/match");

function History() {

    const [listHistory, setListHistory] = useState([]);
    const [nameFilter, setNameFilter] = useState('');
    const [from, setFrom] = useState(new Date());
    const [to, setTo] = useState(new Date());

    useEffect(() => {
        getHistoryData();
    }, []);

    useEffect(() => {
        wsMatch.onopen = (event) => {
            console.log('History Connected WebSocket');
        };

        wsMatch.onmessage = function (event) {
            logHistory(event.data);
        };

        wsMatch.onerror = function (event) {
            console.log(event.data);
        };

        // return () => ws.close();
    }, []);

    async function getHistoryData() {
        let params = {
            name: nameFilter,
            from: `${getDate(from)} 00:00:00`,
            to: `${getDate(to)} 23:59:59`,
            sort: 'DESC'
        }
        let res = await filterHistory(params);
        if (res) {
            setListHistory(res);
        }
    }

    async function logHistory(id) {
        let res = await getFingerPrintById(id);
        if (res) {
            if (res.length > 0) {
                let dataSend = {
                    name: res[0].name,
                    sex: res[0].sex,
                    birthday: getDate(res[0].birthday),
                    address: res[0].address,
                    datetime: getTimeToMySql()
                }
                let response = await addHistory(dataSend);
                if (response) {
                    getHistoryData();
                }
            }
        }
    }

    async function handleFilterClick() {
        getHistoryData();
    }

    return (
        <div className={styles.container}>
            <div className={`${styles.panel}`}>
                <div className={styles.panelTitleGroup}>
                    <h4>Lịch sử quét</h4>
                    <div className={styles.formSearch}>
                        <span>Tên</span>
                        <input type="text" className="form-control" onChange={(e) => setNameFilter(e.target.value)} />
                        <span>Từ</span>
                        <input type="date" className="form-control" defaultValue={new Date().toLocaleDateString('en-CA')} onChange={(e) => setFrom(e.target.value)} />
                        <span>Đến</span>
                        <input type="date" className="form-control" defaultValue={new Date().toLocaleDateString('en-CA')} onChange={(e) => setTo(e.target.value)} />
                        <button type="button" className="btn btn-primary" onClick={handleFilterClick}>Lọc</button>
                    </div>
                </div>
                <div className={styles.table}>
                    <table className="table table-striped table-dark table-hover">
                        <thead>
                            <tr>
                                <th scope="col">STT</th>
                                <th scope="col">Tên</th>
                                <th scope="col">Giới tính</th>
                                <th scope="col">Ngày sinh</th>
                                <th scope="col">Địa chỉ</th>
                                <th scope="col">Thời gian quét</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                listHistory.length > 0 ?
                                    listHistory.map((element, index) => {
                                        return (
                                            <tr key={index}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{element.name}</td>
                                                <td>{element.sex}</td>
                                                <td>{new Date(element.birthday).toLocaleDateString()}</td>
                                                <td>{element.address}</td>
                                                <td>{getTimeFromMySql(element.datetime)}</td>
                                            </tr>
                                        )
                                    }) : null
                            }
                        </tbody>
                    </table>
                    {
                        listHistory.length === 0 ? <div className={styles.empty}>Không có dữ liệu </div> : null
                    }
                    
                </div>
            </div>
        </div>
    )
}

export default History;