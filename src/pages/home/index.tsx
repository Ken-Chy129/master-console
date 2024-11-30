import {Loading} from "@/components/Common/Loading";
import {Form} from "antd";

const HomePage = () => {
    return <>
        <Loading loading={false} content={
            <Form>
                <Form.Item>
                    asdasd
                </Form.Item>
            </Form>
        }/>
    </>
}

export default HomePage;