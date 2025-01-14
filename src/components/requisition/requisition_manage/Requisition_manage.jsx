import {
    Drawer, Form, Button, Col, Row, Input, Select, Divider, Radio
} from 'antd';
import React,{Component} from "react";
import axios from "axios";
import '../../../config/config'
import saveLoginInfo from '../../../utils/saveLogInfo'

const { Option } = Select;
const RadioGroup = Radio.Group;

class DrawerForm extends Component {

    constructor(props){
        super(props);

        this.state = {
            visible: false,

        };
    }


    onClose = () => {
        this.props.RequisitionList.setState({
            visible: false,
        });
    };

    completeApproval = () => {
        let member_id = JSON.parse(sessionStorage.getItem("temp_user")).member_id;
        let api = global.AppConfig.serverIP + '/completeApproval?requisition_id='+this.props.RequisitionList.state.requisition.requisition_id+'&requisition_state='+this.props.RequisitionList.state.requisition.requisition_state + '&member_id='+member_id;
        axios.post(api)
            .then((response)=> {
                console.log(response);
                console.log(JSON.stringify(response.data));
                //this.props.MemberList.run();
                alert("已完成审批");
                this.props.RequisitionList.shenpiState(response.data);
                // this.props.RequisitionList.setState({
                //     requisitionList: response.data,
                // })
            })
            .catch( (error)=> {
                console.log(error);
            });
        this.onClose();
    };

    rejectRequest=()=>{
        let api = global.AppConfig.serverIP + '/rejectRequest?requisition_id='+this.props.RequisitionList.state.requisition.requisition_id+'&requisition_state='+this.props.RequisitionList.state.requisition.requisition_state;
        axios.post(api)
            .then((response)=> {
                console.log(response);
                console.log(JSON.stringify(response.data));
                //this.props.MemberList.run();
                alert("已完成驳回");//驳回是指：当级别n完成审核时，而n+1认为n的审核不正确，可以把上一级的驳回，让其重新审核
                this.props.RequisitionList.shenpiState(response.data);
                // this.props.RequisitionList.setState({
                //     requisitionList: response.data,
                // })
            })
            .catch( (error)=> {
                console.log(error);
            });
        this.onClose();
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.addRequisition(values);
                this.onClose();
            }
        });

    };

    addRequisition=(requisition)=>{
        /**使用axios将value表单信息发送到后端
         * */
        //requisition_firstexam_member


        requisition.requisition_firstexam_member = this.props.RequisitionList.state.firstMemberId;
        requisition.requisition_secondexam_member = this.props.RequisitionList.state.secondMemberId;
        requisition.requisition_thirdexam_member = this.props.RequisitionList.state.thirdMemberId;

        console.log("三个人员ID  "+requisition.requisition_firstexam_member+ "  "+ requisition.requisition_secondexam_member+" "+requisition.requisition_thirdexam_member);
        saveLoginInfo('更新了申请单编号'+requisition.requisition_number+'的信息');
        let api = global.AppConfig.serverIP + '/updateRequisition';
        axios.post(api,requisition)
            .then((response)=> {
                console.log(response);
                console.log(JSON.stringify(response.data));
                //this.props.MemberList.run();
                this.props.RequisitionList.showPageList();
                // this.props.RequisitionList.setState({
                //     requisitionList: response.data,
                // })
               console.log("更新成功！")
            })
            .catch( (error)=> {
                console.log(error);
            });
    };

    /** 当采用弹出新页面时候使用的方法
     * */

    handleReport=()=>{
        const w=window.open('about:blank');
        w.location.href=`/printReport/${this.props.RequisitionList.state.requisition.requisition_id}`;
            //以下为备用方法，可直接写在button标签内，但经过实测IE浏览器可能出现无法传值的情况
            // <Link to="/printReport" target="_blank">测试弹出</Link>
            // <Link to={`/printReport/${this.props.RequisitionList.state.requisition.requisition_id}`}
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '86',
        })(
            <Select style={{ width: 70 }}>
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
            </Select>
        );
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };


        return (
            <div className="requisition_manage">
                {/*<Button type="default" onClick={this.showDrawer}>*/}
                {/*    <Icon type="plus" /> 添加新申请单*/}
                {/*</Button>*/}
                <Drawer
                    title="审核申请单"
                    width={1200}
                    onClose={this.onClose}
                    visible={this.props.RequisitionList.state.visible}
                    placement="left"
                >
                    <Form  layout="vertical"  onSubmit={this.handleSubmit}>
                        <Row gutter={20} >
                            <Col span={4}>
                                <Form.Item label="申请单id" style={{display:true}}>
                                    {getFieldDecorator('requisition_id', {
                                        rules: [{ required: true, message: '申请单id' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_id,
                                    })(<Input placeholder="申请单id" />)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="工程编号">
                                    {getFieldDecorator('requisition_number', {
                                        rules: [{ required: true, message: '请输入工程编号' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_number
                                    })(<Input placeholder="工程编号" />)}
                                </Form.Item>
                            </Col>

                            <Col span={4}>
                                <Form.Item label="工程名称">
                                    {getFieldDecorator('requisition_name', {
                                        rules: [{ required: true, message: '请输入工程名称' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_name
                                    })(<Input placeholder="工程名称" />)}
                                </Form.Item>
                            </Col>

                            <Col span={4}>
                                <Form.Item label="结构名称">
                                    {getFieldDecorator('requisition_structurename', {
                                        rules: [{ required: true, message: '请输入结构名称' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_structurename
                                    })(<Input placeholder="结构名称" />)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="施工单位">
                                    {getFieldDecorator('requisition_constructunit', {
                                        rules: [{ required: true, message: '请输入施工单位' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_constructunit
                                    })(<Input placeholder="施工单位" />)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="焊接方法">
                                    {getFieldDecorator('requisition_weldingmethod', {
                                        rules: [{ required: true, message: '请输入焊接方法' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_weldingmethod
                                    })(<Input placeholder="焊接方法" />)}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={20}>
                            <Col span={4}>
                                <Form.Item label="存放位置">
                                    {getFieldDecorator('requisition_saveplace', {
                                        rules: [{ required: true, message: '请输入存放位置' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_saveplace
                                    })(<Input placeholder="存放位置" />)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="来样编号">
                                    {getFieldDecorator('requisition_samplenumber', {
                                        rules: [{ required: true, message: '请输入来样编号' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_samplenumber
                                    })(<Input placeholder="来样编号" />)}
                                </Form.Item>
                            </Col>

                            <Col span={4}>
                                <Form.Item label="黑度值">
                                    {getFieldDecorator('requisition_density', {
                                        rules: [{ required: true, message: '请输入黑度值' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_density
                                    })(<Input placeholder="黑度值" />)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="报告编号">
                                    {getFieldDecorator('requisition_reportnumber', {
                                        rules: [{ required: true, message: '请输入报告编号' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_reportnumber
                                    })(<Input placeholder="报告编号" />)}
                                </Form.Item>
                            </Col>

                            <Col span={4}>
                                <Form.Item label="胶片型号">
                                    {getFieldDecorator('requisition_filmtype', {
                                        rules: [{ required: true, message: '请输入胶片型号' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_filmtype
                                    })(<Input placeholder="胶片型号" />)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="检测标准">
                                    {getFieldDecorator('requisition_testingstandard', {
                                        rules: [{ required: true, message: '请输入检测标准' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_testingstandard
                                    })(<Input placeholder="检测标准" />)}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={4}>
                                <Form.Item label="合格级别">
                                    {getFieldDecorator('requisition_qualificationlevel', {
                                        rules: [{ required: true, message: '请输入合格级别' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_qualificationlevel
                                    })(<Input placeholder="合格级别" />)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="增感屏">
                                    {getFieldDecorator('requisition_intensifyscreen', {
                                        rules: [{ required: true, message: '请输入增感屏' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_intensifyscreen
                                    })(<Input placeholder="增感屏" />)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="管电流">
                                    {getFieldDecorator('requisition_tubecurrent', {
                                        rules: [{ required: true, message: '请输入管电流' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_tubecurrent
                                    })(<Input placeholder="管电流" />)}
                                </Form.Item>
                            </Col>

                            <Col span={4}>
                                <Form.Item label="管电压">
                                    {getFieldDecorator('requisition_tubevoltage', {
                                        rules: [{ required: true, message: '请输入管电压' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_tubevoltage
                                    })(<Input placeholder="管电压" />)}
                                </Form.Item>
                            </Col>

                            <Col span={4}>
                                <Form.Item label="曝光时间">
                                    {getFieldDecorator('requisition_exposuretime', {
                                        rules: [{ required: true, message: '请输入曝光时间' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_exposuretime
                                    })(<Input placeholder="曝光时间" />)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="敏感度">
                                    {getFieldDecorator('requisition_sensitivity', {
                                        rules: [{ required: true, message: '请输入敏感度' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_sensitivity
                                    })(<Input placeholder="敏感度" />)}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={4}>
                                <Form.Item label="焦距">
                                    {getFieldDecorator('requisition_focus', {
                                        rules: [{ required: true, message: '请输入焦距' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_focus
                                    })(<Input placeholder="焦距" />)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="显影时间">
                                    {getFieldDecorator('requisition_developmenttime', {
                                        rules: [{ required: true, message: '请输入显影时间' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_developmenttime
                                    })(<Input placeholder="显影时间" />)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="显影温度">
                                    {getFieldDecorator('requisition_developertemperature', {
                                        rules: [{ required: true, message: '请输入显影温度' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_developertemperature
                                    })(<Input placeholder="显影温度" />)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="钢号">
                                    {getFieldDecorator('requisition_steelnumber', {
                                        rules: [{ required: true, message: '请输入钢号' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_steelnumber
                                    })(<Input placeholder="钢号" />)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="接头形式">
                                    {getFieldDecorator('requisition_jointform', {
                                        rules: [{ required: true, message: '请输入接头形式' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_jointform
                                    })(<Input placeholder="接头形式" />)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="仪器型号">
                                    {getFieldDecorator('requisition_instrumenttype', {
                                        rules: [{ required: true, message: '请输入仪器型号' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_instrumenttype
                                    })(<Input placeholder="仪器型号" />)}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={4}>
                                <Form.Item label="影像图数量">
                                    {getFieldDecorator('requisition_totalnumber', {
                                        rules: [{ required: true, message: '请输入影像图数量' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_totalnumber
                                    })(<Input placeholder="影像图数量" />)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="返工次数">
                                    {getFieldDecorator('requisition_reworktimes', {
                                        rules: [{ required: true, message: '请输入返工次数' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_reworktimes
                                    })(<Input placeholder="返工次数" />)}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={16}>
                                <Form.Item label="申请单备注信息">
                                    {getFieldDecorator('requisition_ps', {
                                        rules: [{ required: false, message: '请输入申请单备注信息' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_ps
                                    })(<Input.TextArea rows={4} placeholder="申请单备注信息" />)}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={4}>
                                <Form.Item label="一级审核结果">
                                    {getFieldDecorator('requisition_firstexam', {
                                        rules: [{ required: true, message: '请输入一级审核结果' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_firstexam
                                    })(<Input placeholder="一级审核结果" disabled={"true"}/>)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="一级审核人员">
                                    {getFieldDecorator('requisition_firstexam_member', {
                                        rules: [{ required: true, message: '请输入一级审核人员' }],
                                        initialValue: this.props.RequisitionList.state.firstMember
                                    })(<Input placeholder="一级审核人员" disabled={"true"}/>)}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="一级审核意见">
                                    {getFieldDecorator('requisition_firstopinion', {
                                        rules: [{ required: false, message: '请输入一级审核意见' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_firstopinion
                                    })(<Input.TextArea rows={4} placeholder="一级审核意见" disabled={this.props.RequisitionList.state.threeRoleManage.requisition_firstexam}/>)}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={4}>
                                <Form.Item label="二级审核结果">
                                    {getFieldDecorator('requisition_secondexam', {
                                        rules: [{ required: true, message: '请输入二级审核结果' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_secondexam
                                    })(<Input placeholder="二级审核结果" disabled={"true"}/>)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="二级审核人员">
                                    {getFieldDecorator('requisition_secondexam_member', {
                                        rules: [{ required: true, message: '请输入二级审核人员' }],
                                        initialValue: this.props.RequisitionList.state.secondMember
                                    })(<Input placeholder="二级审核人员" disabled={"true"}/>)}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="二级审核意见">
                                    {getFieldDecorator('requisition_secondopinion', {
                                        rules: [{ required: false, message: '请输入二级审核意见' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_secondopinion
                                    })(<Input.TextArea rows={4} placeholder="二级审核意见" disabled={this.props.RequisitionList.state.threeRoleManage.requisition_secondexam}/>)}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={4}>
                                <Form.Item label="三级审核结果">
                                    {getFieldDecorator('requisition_thirdexam', {
                                        rules: [{ required: true, message: '请输入三级审核结果' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_thirdexam
                                    })(<Input placeholder="三级审核结果" disabled={"true"}/>)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="三级审核人员">
                                    {getFieldDecorator('requisition_thirdexam_member', {
                                        rules: [{ required: true, message: '请输入三级审核人员' }],
                                        initialValue: this.props.RequisitionList.state.thirdMember
                                    })(<Input placeholder="三级审核人员" disabled={"true"}/>)}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="三级审核意见">
                                    {getFieldDecorator('requisition_thirdopinion', {
                                        rules: [{ required: false, message: '请输入三级审核意见' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_thirdopinion
                                    })(<Input.TextArea rows={4} placeholder="三级审核意见" disabled={this.props.RequisitionList.state.threeRoleManage.requisition_thirdexam}/>)}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={0}>
                                <Form.Item label="审核状态" >
                                    {getFieldDecorator('requisition_state', {
                                        rules: [{ required: true, message: '审核状态' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_state
                                    })(<Input placeholder="审核状态"  disabled={this.props.RequisitionList.state.requisition_tubevoltage_disabled}/>)}
                                </Form.Item>
                            </Col>
                            <Col span={0} >
                                <Form.Item label="是否提交（扫描端）" style={{display:"none"}}>
                                    {getFieldDecorator('requisition_submit', {
                                        rules: [{ required: true, message: '是否提交' }],
                                        initialValue: 1
                                        // initialValue: this.props.RequisitionList.state.requisition.requisition_submit
                                    })(<Input placeholder="是否提交" />)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label="存入时间">
                                    {getFieldDecorator('requisition_entrytime', {
                                        rules: [{ required: true, message: '存入时间' }],
                                        initialValue: this.props.RequisitionList.state.requisition.requisition_entrytime
                                    })(<Input placeholder="存入时间" />)}
                                </Form.Item>
                            </Col>

                        </Row>
                        <br/><br/>
                        <Divider />
                        <Row gutter={16}>
                            <Col span={4}>
                                <Form.Item >
                                    <Button onClick={this.onClose} style={{ marginRight: 8 }}>关闭当前窗口</Button>
                                </Form.Item>
                            </Col>

                            <Col span={4}>
                                <Form.Item >
                                    <Button type="danger" disabled={this.props.RequisitionList.state.requisition_button_disabled} onClick={this.rejectRequest} style={{ marginRight: 8 }}>驳回申请单</Button>
                                </Form.Item>
                            </Col>

                            <Col span={4}>
                                <Form.Item >
                                    <Button type="primary" disabled={this.props.RequisitionList.state.requisition_button_disabled} onClick={this.completeApproval} style={{ marginRight: 8 }}>完成审批</Button>
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item >
                                    <Button  type="primary" htmlType="submit" onClick={this.handleReport}>生成检测报告</Button>
                                </Form.Item>
                            </Col>

                            <Col span={4}>
                                <Form.Item >
                                    <Button type="danger"  htmlType="submit">提交并更改审核信息</Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>

                </Drawer>
            </div>
        );
    }
}

const Requisition_manage = Form.create()(DrawerForm);

export default Requisition_manage;