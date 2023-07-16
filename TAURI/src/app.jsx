import NavigationBar from "./navigation.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Homepage from "./homepage.jsx";
import Login from "./routes/login.jsx";
import Logout from "./routes/logout.jsx";
import Profile from "./routes/profile.jsx";
import CreateAccount from "./routes/createAccount.jsx";
import UserPage from "./routes/userPage.jsx";
import UploadPage from "./routes/uploadREGULAR.jsx";
import ViewDownloads from "./routes/viewDownloads.jsx";
function App() {
    return (
        <>
            <BrowserRouter>
                <NavigationBar />
                    <Routes>
                        <Route path ="/" element={<Homepage/>} />
                        <Route path ="login" element={<Login/>} />
                        <Route path ="logout" element={<Logout/>} />
                        <Route path="my_profile" element={<Profile/>}/>
                        <Route path="create_account" element={<CreateAccount/>}/>
                        <Route path ="user/:userID" element={<UserPage/>} />
                        <Route path ="upload" element={<UploadPage/>} />
                        <Route path ="viewDownloads" element={<ViewDownloads/>} />
                    </Routes>
            </BrowserRouter>
        </>
    )
}
export default App