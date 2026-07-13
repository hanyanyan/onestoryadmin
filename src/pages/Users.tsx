import React, { useState, useMemo } from 'react';
import {
  Table,
  Button,
  Input,
  Typography,
  message,
  InputNumber,
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  DownloadOutlined,
  EditOutlined,
  CheckOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

interface UserRecord {
  uid: string;
  username: string;
  registrationTime: string;
  trustValue: number;
}

const mockUsers: UserRecord[] = [
  {
    uid: '430136907092418560',
    username: 'LunaFox7758',
    registrationTime: '2026-07-02 11:51:30',
    trustValue: 1.00,
  },
  {
    uid: '430136907092418561',
    username: 'StarDust9921',
    registrationTime: '2026-07-03 09:15:22',
    trustValue: 0.95,
  },
  {
    uid: '430136907092418562',
    username: 'CrystalRain334',
    registrationTime: '2026-07-04 14:30:00',
    trustValue: 0.88,
  },
  {
    uid: '430136907092418563',
    username: 'MoonWalker667',
    registrationTime: '2026-07-05 10:00:15',
    trustValue: 0.72,
  },
  {
    uid: '430136907092418564',
    username: 'NeonTiger112',
    registrationTime: '2026-07-06 16:45:33',
    trustValue: 0.50,
  },
  {
    uid: '430136907092418565',
    username: 'SilverHawk889',
    registrationTime: '2026-07-07 08:20:44',
    trustValue: 0.65,
  },
  {
    uid: '430136907092418566',
    username: 'DarkPhoenix456',
    registrationTime: '2026-07-08 12:10:55',
    trustValue: 0.30,
  },
  {
    uid: '430136907092418567',
    username: 'GoldenEagle234',
    registrationTime: '2026-07-09 18:30:10',
    trustValue: 0.99,
  },
  {
    uid: '430136907092418568',
    username: 'BlueOcean778',
    registrationTime: '2026-07-10 07:25:00',
    trustValue: 0.85,
  },
  {
    uid: '430136907092418569',
    username: 'RedDragon990',
    registrationTime: '2026-07-11 22:05:40',
    trustValue: 0.10,
  },
  {
    uid: '430136907092418570',
    username: 'FrostWolf123',
    registrationTime: '2026-07-12 15:50:12',
    trustValue: 0.60,
  },
  {
    uid: '430136907092418571',
    username: 'StormRider456',
    registrationTime: '2026-07-13 09:00:00',
    trustValue: 0.78,
  },
];

type SortDirection = 'asc' | 'desc' | undefined;

const Users: React.FC = () => {
  const [usernameFilter, setUsernameFilter] = useState('');
  const [uidFilter, setUidFilter] = useState('');
  const [parentUidFilter, setParentUidFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [users, setUsers] = useState<UserRecord[]>(() =>
    mockUsers.map((u) => ({ ...u }))
  );
  const [editingTrustUid, setEditingTrustUid] = useState<string | null>(null);
  const [editingTrustValue, setEditingTrustValue] = useState<number>(0);
  const [sortDirection, setSortDirection] = useState<SortDirection>(undefined);

  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (usernameFilter) {
      const lower = usernameFilter.toLowerCase();
      result = result.filter((u) => u.username.toLowerCase().includes(lower));
    }
    if (uidFilter) {
      result = result.filter((u) => u.uid.includes(uidFilter));
    }
    if (parentUidFilter) {
      result = result.filter((u) => u.uid.includes(parentUidFilter));
    }
    if (sortDirection === 'asc') {
      result.sort((a, b) => a.trustValue - b.trustValue);
    } else if (sortDirection === 'desc') {
      result.sort((a, b) => b.trustValue - a.trustValue);
    }

    return result;
  }, [users, usernameFilter, uidFilter, parentUidFilter, sortDirection]);

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleReset = () => {
    setUsernameFilter('');
    setUidFilter('');
    setParentUidFilter('');
    setCurrentPage(1);
    setSortDirection(undefined);
  };

  const handleExport = () => {
    message.info('Export functionality - coming soon');
  };

  const startEditingTrust = (record: UserRecord) => {
    setEditingTrustUid(record.uid);
    setEditingTrustValue(record.trustValue);
  };

  const saveEditingTrust = (uid: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.uid === uid ? { ...u, trustValue: editingTrustValue } : u
      )
    );
    setEditingTrustUid(null);
  };

  const toggleSort = () => {
    if (sortDirection === undefined) {
      setSortDirection('desc');
    } else if (sortDirection === 'desc') {
      setSortDirection('asc');
    } else {
      setSortDirection(undefined);
    }
  };

  const columns: ColumnsType<UserRecord> = [
    {
      title: 'No.',
      width: 60,
      render: (_: unknown, __: unknown, index: number) => {
        return (currentPage - 1) * pageSize + index + 1;
      },
    },
    {
      title: 'UID',
      dataIndex: 'uid',
      key: 'uid',
    },
    {
      title: (
        <span style={{ cursor: 'pointer', userSelect: 'none' }} onClick={toggleSort}>
          Trust值{' '}
          <span style={{ fontSize: 12 }}>
            <CaretUpOutlined
              style={{ color: sortDirection === 'asc' ? '#1890ff' : '#999', marginRight: -2 }}
            />
            <CaretDownOutlined
              style={{ color: sortDirection === 'desc' ? '#1890ff' : '#999' }}
            />
          </span>
        </span>
      ),
      dataIndex: 'trustValue',
      key: 'trustValue',
      width: 140,
      render: (value: number, record: UserRecord) => {
        const isEditing = editingTrustUid === record.uid;
        if (isEditing) {
          return (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <InputNumber
                value={editingTrustValue}
                min={0}
                max={1}
                step={0.01}
                precision={2}
                size="small"
                style={{ width: 80 }}
                onChange={(val) => setEditingTrustValue(val ?? 0)}
              />
              <CheckOutlined
                style={{ color: '#52c41a', cursor: 'pointer', fontSize: 14 }}
                onClick={() => saveEditingTrust(record.uid)}
              />
            </span>
          );
        }
        return (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {value.toFixed(2)}
            <EditOutlined
              style={{ color: '#999', cursor: 'pointer', fontSize: 12 }}
              onClick={() => startEditingTrust(record)}
            />
          </span>
        );
      },
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Registration Time',
      dataIndex: 'registrationTime',
      key: 'registrationTime',
    },
    {
      title: 'Action',
      key: 'action',
      width: 120,
      render: () => null,
    },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>Users</Title>

      <div
        style={{
          display: 'flex',
          gap: 12,
          marginBottom: 16,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <Input
          placeholder="Username"
          value={usernameFilter}
          onChange={(e) => setUsernameFilter(e.target.value)}
          style={{ width: 180 }}
          allowClear
        />
        <Input
          placeholder="UID"
          value={uidFilter}
          onChange={(e) => setUidFilter(e.target.value)}
          style={{ width: 180 }}
          allowClear
        />
        <Input
          placeholder="Parent UID"
          value={parentUidFilter}
          onChange={(e) => setParentUidFilter(e.target.value)}
          style={{ width: 180 }}
          allowClear
        />
        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
          Search
        </Button>
        <Button icon={<ReloadOutlined />} onClick={handleReset}>
          Reset
        </Button>
        <Button icon={<DownloadOutlined />} onClick={handleExport}>
          Export
        </Button>
      </div>

      <Table<UserRecord>
        columns={columns}
        dataSource={filteredUsers}
        rowKey="uid"
        bordered
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: filteredUsers.length,
          onChange: (page, size) => {
            setCurrentPage(page);
            if (size) setPageSize(size);
          },
          showTotal: (total) => `Total: ${total}`,
          showSizeChanger: true,
          pageSizeOptions: ['20'],
          size: 'default',
        }}
        onRow={() => ({
          style: { cursor: 'default' },
          onMouseEnter: (e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = '#f5f5f5';
          },
          onMouseLeave: (e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = '';
          },
        })}
      />
    </div>
  );
};

export default Users;