import { Outlet } from "react-router-dom";
export default function Root() {
    return (
        <>
            <div id="Navigation">
                <h1>Pages</h1>
                <nav>
                    <ul>
                        <li>
                            <a href={`/Login`}>Login</a>
                        </li>
                    </ul>
                </nav>
            </div>
            <div id="detail">
                <Outlet />
            </div>
        </>
    );
}