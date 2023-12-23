import styles from '../styles/home.module.css';
import logo from '../../public/images/logo.png';
import Image from 'next/image';
import { useRouter } from 'next/router';

function Home() {
    const router = useRouter();
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={`${styles.logo}`}>
                    <Image alt='logo' src={logo} />
                </div>
                <div className={styles.headerRight}>
                    <h2>TRƯỜNG ĐẠI HỌC CÔNG NGHIỆP TP HỒ CHÍ MINH</h2>
                    <h3>KHOA CÔNG NGHỆ ĐIỆN</h3>
                </div>
            </div>
            <main className={styles.main}>
                <h1>ĐỒ ÁN TỐT NGHIỆP</h1>
                <h3>Đề tài: Hệ thống đồng bộ vân tay lên Cloud</h3>
            </main>
            <footer className={styles.footer}>
                <span>GVHH: Ths.Nguyễn Văn A</span>
                <span>SV: Nguyễn Văn B</span>
                <span>SV: Nguyễn Văn C</span>
            </footer>
            <div className={styles.btn}>
                <button
                    className="codepro-custom-btn codepro-btn-3"
                    target="blank"
                    onClick={()=> router.push('./finger-manager')}>
                    <span>Quản lý vân tay</span>
                </button>
                <button
                    className="codepro-custom-btn codepro-btn-3"
                    target="blank"
                    onClick={()=> router.push('./history')}>
                    <span>Lịch sử quét</span>
                </button>
            </div>
        </div>
    )
}

export default Home;