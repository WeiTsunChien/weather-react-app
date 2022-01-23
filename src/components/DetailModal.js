import React from 'react';
import { connect } from 'react-redux';
import { Modal, Table, Row, Col } from 'antd';
import airFlow from '../assets/images/airFlow.svg';
import rain from '../assets/images/rain.svg';
import WeatherImage from './WeatherImage';

const DetailModal = (props) => {
    const { isModalVisible, closeModal, forecasts, record } = props;
    //console.log('isModalVisible', isModalVisible);
    //console.log('天氣預報', forecasts);
    //console.log('天氣報告', record);

    const columns = [
        {
            title: '時段',
            dataIndex: 'period',
            key: 'period',
        },
        {
            title: '天氣狀況',
            dataIndex: 'wxName',
            key: 'wxName',
        },
        {
            title: '降雨機率',
            dataIndex: 'poP',
            key: 'poP',
            render: text => {
                return text + '%';
            },
        },
        {
            title: '最低溫',
            dataIndex: 'minT',
            key: 'minT',
        },
        {
            title: '最高溫',
            dataIndex: 'maxT',
            key: 'maxT',
        },
        {
            title: '天氣描述',
            dataIndex: 'ci',
            key: 'ci',
        }
    ]

    const wxName = forecasts.length ? forecasts[0].wxName : '';
    const wxValue = forecasts.length ? forecasts[0].wxValue : null;

    return (
        <Modal visible={isModalVisible}
            onCancel={closeModal}
            footer={null}>
            <Row>
                <Col span={16}>
                    <h1>{`${record.CITY} ${record.TOWN}`}</h1>
                    <h3>{record.Weather == '' ? wxName : record.Weather}</h3>
                    <Row>
                        <Col span={13}>
                            {record.TEMP == '' ?
                                '無溫度資料' :
                                (
                                    <div className='modal-temp'>
                                        {record.TEMP}
                                        <span className='unit'>&deg;C</span>
                                    </div>
                                )
                            }
                        </Col>
                        <Col span={11}>
                            <div className='modal-info'>
                                <div className='modal-info-item'>
                                    <img src={airFlow} />
                                    <span>{record.WDSD == '' ? '無風速資料' : record.WDSD}</span>
                                </div>
                                <div className='modal-info-item'>
                                    <img src={rain} />
                                    <span>{forecasts.length ? `${forecasts[0].poP}%` : ''}</span>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col span={8}>
                    <WeatherImage wxValue={wxValue} />
                </Col>
            </Row>
            <Table
                rowKey={record => record.startTime}
                columns={columns}
                dataSource={forecasts}
                pagination={false} />
        </Modal>
    );
};

const mapStateToProps = (state) => {
    return {
        forecasts: state.weatherData.weatherForecasts,
    };
}

const mapDispatchToProps = dispatch => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailModal)
