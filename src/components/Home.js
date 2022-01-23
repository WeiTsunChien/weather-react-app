import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { CSVLink } from 'react-csv';
import { Table, Tooltip, Checkbox, Button, Modal } from 'antd';
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
                if (recordA.TEMP < recordB.TEMP) return -1;
                if (recordB.TEMP < recordA.TEMP) return 1;
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
        //console.log("取得報告 1");
        setGettingReports(true);
        await getCurrentWeatherReports();
        setGettingReports(false);
        //console.log("取得報告 2");
    }

    const showModal = async (record) => {
        //console.log(record.obsTime);
        const obsDate = record.obsTime.split(' ')[0];
        //console.log('觀測日期', obsDate);
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
        //console.log("useEffect 1");
        await getReports();
        //console.log("useEffect 2");
        return () => {
            //console.log("useEffect return");
        }
    }, []);

    const rowSelection = {
        type: 'checkbox',
        onChange: (selectedRowKeys, selectedRows) => {
            console.log('選定的行鍵', selectedRowKeys);
            console.log('選定的行', selectedRows);
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

    console.log("Home 返回");
    return (
        <>
            <CSVLink
                data={selectedRows.length ? selectedRows : reports}
                headers={csvHeaders}
                filename={"my-weather-reports.csv"}
                className="btn btn-primary"
                target="_blank">
                <Button type="primary" icon={<ExportOutlined />} loading={gettingReports}>
                    Export
                </Button>
            </CSVLink>
            <Button type="primary" icon={<ReloadOutlined />} loading={gettingReports} onClick={getReports}>
                Refresh
            </Button>
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
        </>
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