import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { CSVLink } from 'react-csv';
import { Table, Tooltip, Checkbox, Button, Modal, Row, Col } from 'antd';
import { ExportOutlined, ReloadOutlined, ProfileTwoTone } from '@ant-design/icons';
import DetailModal from './DetailModal';
import { getCurrentWeatherReports, getWeatherForecasts, getSumTime } from '../actions/weatherAction';

const csvHeaders = [
    { label: '縣市', key: 'CITY' },
    { label: '地區', key: 'TOWN' },
    { label: '觀測時間', key: 'obsTime' },
    { label: '天氣', key: 'Weather' },
    { label: '溫度', key: 'TEMP' },
    { label: '風速', key: 'WDSD' },
];

export const Home = (props) => {
    const [gettingReports, setGettingReports] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [gettingModalData, setGettingModalData] = useState(false);
    const [modalRecord, setModalRecord] = useState({});

    const {
        getCurrentWeatherReports,
        getWeatherForecasts,
        getSumTime,
        reports,
        cityFilters } = props;

    const columns = [
        {
            title: '縣市',
            dataIndex: 'CITY',
            key: 'CITY',
            filters: cityFilters,
            onFilter: (value, record) => record.CITY === value
        },
        {
            title: '地區',
            dataIndex: 'TOWN',
            key: 'TOWN',
        },
        {
            title: '觀測時間',
            dataIndex: 'obsTime',
            key: 'obsTime',
            sorter: (recordA, recordB) => {
                if (recordA.obsTime < recordB.obsTime) return -1;
                if (recordB.obsTime < recordA.obsTime) return 1;
                return 0;
            },
            sortDirections: ['ascend', 'descend']
        },
        {
            title: '天氣',
            dataIndex: 'Weather',
            key: 'Weather',
        },
        {
            title: '溫度',
            dataIndex: 'TEMP',
            key: 'TEMP',
            sorter: (recordA, recordB) => {
                const tempA = recordA.TEMP == '無資料' ? -1 : recordA.TEMP;
                const tempB = recordB.TEMP == '無資料' ? -1 : recordB.TEMP;

                if (tempA < tempB) return -1;
                if (tempB < tempA) return 1;
                return 0;
            },
            sortDirections: ['ascend', 'descend']
        },
        {
            title: '風速',
            dataIndex: 'WDSD',
            key: 'WDSD',
        },
        {
            render: (text, record) => {
                return (
                    <Tooltip title="更多資訊">
                        <Button type="text"
                            loading={gettingModalData}
                            icon={<ProfileTwoTone />}
                            onClick={() => { showModal(record) }}>
                        </Button>
                    </Tooltip>
                );
            }
        },
    ]

    const getReports = async () => {
        setGettingReports(true);
        await getCurrentWeatherReports();
        setGettingReports(false);
    }

    const showModal = async (record) => {
        const obsDate = record.obsTime.split(' ')[0];
        setGettingModalData(true);
        await getWeatherForecasts(record.CITY);
        await getSumTime(record.CITY, obsDate);
        setGettingModalData(false);
        setModalRecord(record);
        setIsModalVisible(true);
    }

    const closeModal = () => {
        setIsModalVisible(false);
    };

    useEffect(async () => {
        await getReports();
        return () => {
        }
    }, []);

    const rowSelection = {
        type: 'checkbox',
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRows(selectedRows);
        },
        getCheckboxProps: (record) => ({
        }),
        renderCell: (checked, record, index, originNode) => {
            return (
                <Tooltip title="輸出該筆資料至 csv">
                    {originNode}
                </Tooltip>
            )
        }
    };

    return (
        <div className='container'>
            <Row className='app-header'>
                <Col span={16}>
                    <h2>即時天氣</h2>
                </Col>
                <Col span={8} className='btn-box'>
                    <CSVLink
                        data={selectedRows.length ? selectedRows : reports}
                        headers={csvHeaders}
                        filename={"my-weather-reports.csv"}
                        className="btn btn-primary"
                        target="_blank">
                        <Button type="primary" className='btn-round-corner' icon={<ExportOutlined />} loading={gettingReports}>
                            Export
                        </Button>
                    </CSVLink>
                    <Button type="primary" className='btn-round-corner ml-3' icon={<ReloadOutlined />} loading={gettingReports} onClick={getReports}>
                        Refresh
                    </Button>
                </Col>
            </Row>
            <Table
                rowSelection={rowSelection}
                rowKey={record => record.stationId}
                columns={columns}
                dataSource={reports}
                pagination={{ pageSize: 20, }}
                loading={gettingReports} />
            <DetailModal
                isModalVisible={isModalVisible}
                record={modalRecord}
                closeModal={closeModal} />
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        reports: state.weatherData.currentWeatherReports,
        cityFilters: state.weatherData.cityFilters
    };
}

const mapDispatchToProps = dispatch => {
    return {
        getCurrentWeatherReports: () => dispatch(getCurrentWeatherReports()),
        getWeatherForecasts: (cityName) => dispatch(getWeatherForecasts(cityName)),
        getSumTime: (cityName, date) => dispatch(getSumTime(cityName, date))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)