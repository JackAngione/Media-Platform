import { Outlet} from "react-router-dom";


export default function Root() {
    return (
        <>
            <div id="Navigation">
                <h1>Pages</h1>
            </div>
            <div id="detail">
                <nav>
                    <ul>
                        <li>
                            <a href={`/homepage`}>Homepage</a>
                        </li>
                        <li>
                            <a href={`/login`}>Login</a>
                        </li>
                        <li>
                            <a href={`/upload`}>Upload File</a>
                        </li>
                        <li>
                            <a href={`/user/xxxxxxx`}>Jack User Page</a>
                        </li>

                    </ul>
                </nav>
                <Outlet />
            </div>
        </>
    );
}