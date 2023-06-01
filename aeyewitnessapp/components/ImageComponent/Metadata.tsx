import { Table } from 'antd';
import { IMetaData } from '@/store/models/Files';

const COLUMNS = [
    {
        title: 'Property',
        dataIndex: 'property',
        key: 'property'
    },
    {
        title: 'Value',
        dataIndex: 'value',
        key: 'value'
    }
]

const MetaData = ({
    Name,
    Longitute,
    Latitute,
    LocalTime,
    Accuracy,
    Altitude,
    AltitudeAccuracy,
    Heading,
    Speed,
    ServerTime,
}: IMetaData) => {
    const formatDate = (date: Date | undefined) => {
        if (date === undefined) {
            return null;
        }

        const d = new Date(date)
        return d.toLocaleDateString() + " " + d.toLocaleTimeString()
    }

    const dataSource = [
        {
            key: 0,
            property: 'Filename',
            value: Name || 'N/A'
        },
        {
            key: 1,
            property: 'Longitude',
            value: Longitute || 'N/A'
        },
        {
            key: 2,
            property: 'Latitude',
            value: Latitute || 'N/A'
        },
        {
            key: 3,
            property: 'Accuracy',
            value: Accuracy ? Accuracy.toFixed(2) + ' m' : 'N/A'
        },
        {
            key: 4,
            property: 'Altitude',
            value: Altitude ? Altitude.toFixed(2) + ' m' : 'N/A'
        },
        {
            key: 5,
            property: 'Altitude accuracy',
            value: AltitudeAccuracy ? AltitudeAccuracy.toFixed(2) + ' m' : 'N/A'
        },
        {
            key: 6,
            property: 'Speed',
            value: Speed?.toFixed(2) + ' m/s'
        }, {
            key: 7,
            property: 'Heading',
            value: Heading
        },
        {
            key: 8,
            property: 'Local time',
            value: formatDate(LocalTime)
        },
        {
            key: 9,
            property: 'Server time',
            value: formatDate(ServerTime)
        }
    ]

    return <Table dataSource={dataSource} columns={COLUMNS} pagination={false} />
}

export default MetaData;
