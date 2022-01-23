import { Link } from "react-router-dom";
import * as routes from '../../constants/routes';

const NoPage = () => {
    return (
        <div>
            <h3>這頁不存在</h3>
            <Link to={routes.HOME}>回首頁</Link>
        </div>
    )
}

export default NoPage