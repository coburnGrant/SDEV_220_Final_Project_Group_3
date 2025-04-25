import Form from "../components/Form";
import { FORM_METHOD_LOGIN } from "../constants/constants";

function Login() {
    return <Form route="/api/token/" method={FORM_METHOD_LOGIN} />
}   

export default Login;