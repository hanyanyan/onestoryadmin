import React, { useState, useMemo } from 'react';
import {
  Table,
  Select,
  Button,
  Tag,
  Avatar,
  Input,
  Typography,
  InputNumber,
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  EditOutlined,
  CheckOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Actor, AuditStatus, BadgeType, AUDIT_STATUS_OPTIONS } from '../types';
import { mockActors } from '../data/mockActors';
import SetBadgeModal from '../components/SetBadgeModal';

const { Title } = Typography;

const statusColorMap: Record<string, string> = {
  Minted: 'green',
  'Pending NFT Mint': 'purple',
  Approved: 'blue',
  'Pending Review': 'orange',
  Rejected: 'red',
  Offline: 'default',
  Deleted: 'gray',
};

const badgeColorMap: Record<string, string> = {
  'Official Actor': 'gold',
  'Partner Actor': 'cyan',
  'Verified Creator': 'purple',
  'Community Actor': 'blue',
};

type SortDirection = 'asc' | 'desc' | undefined;

const ActorList: React.FC = () => {
  const [auditStatusFilter, setAuditStatusFilter] = useState<AuditStatus | undefined>(undefined);
  const [idFilter, setIdFilter] = useState('');
  const [actorNameFilter, setActorNameFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [badgeModalOpen, setBadgeModalOpen] = useState(false);
  const [selectedActor, setSelectedActor] = useState<Actor | null>(null);
  const [editingTrustId, setEditingTrustId] = useState<string | null>(null);
  const [editingTrustValue, setEditingTrustValue] = useState<number>(0);
  const [sortDirection, setSortDirection] = useState<SortDirection>(undefined);
  const [actors, setActors] = useState<Actor[]>(() =>
    mockActors.map((a) => ({ ...a }))
  );

  const filteredActors = useMemo(() => {
    let result = [...actors];

    if (auditStatusFilter) {
      result = result.filter((a) => a.auditStatus === auditStatusFilter);
    }
    if (idFilter) {
      result = result.filter((a) => a.id.includes(idFilter));
    }
    if (actorNameFilter) {
      const lower = actorNameFilter.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(lower) ||
          a.englishName.toLowerCase().includes(lower)
      );
    }
    if (sortDirection === 'asc') {
      result.sort((a, b) => a.trustValue - b.trustValue);
    } else if (sortDirection === 'desc') {
      result.sort((a, b) => b.trustValue - a.trustValue);
    }

    return result;
  }, [actors, auditStatusFilter, idFilter, actorNameFilter, sortDirection]);

  const handleReset = () => {
    setAuditStatusFilter(undefined);
    setIdFilter('');
    setActorNameFilter('');
    setCurrentPage(1);
    setSortDirection(undefined);
  };

  const handleSetBadge = (actor: Actor) => {
    setSelectedActor(actor);
    setBadgeModalOpen(true);
  };

  const handleBadgeConfirm = (badge: BadgeType) => {
    if (selectedActor) {
      setActors((prev) =>
        prev.map((a) => (a.id === selectedActor.id ? { ...a, badge } : a))
      );
    }
    setBadgeModalOpen(false);
    setSelectedActor(null);
  };

  const handleBadgeCancel = () => {
    setBadgeModalOpen(false);
    setSelectedActor(null);
  };

  const startEditingTrust = (actor: Actor) => {
    setEditingTrustId(actor.id);
    setEditingTrustValue(actor.trustValue);
  };

  const saveEditingTrust = (actorId: string) => {
    setActors((prev) =>
      prev.map((a) =>
        a.id === actorId ? { ...a, trustValue: editingTrustValue } : a
      )
    );
    setEditingTrustId(null);
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

  const columns: ColumnsType<Actor> = [
    {
      title: 'No.',
      width: 60,
      render: (_: unknown, __: unknown, index: number) => {
        return (currentPage - 1) * pageSize + index + 1;
      },
    },
    {
      title: 'Actor',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Actor) => (
        <a style={{ color: '#1890ff', cursor: 'pointer' }}>
          {name}（{record.englishName}）{record.id.slice(-4)}
        </a>
      ),
    },
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 80,
      render: (avatar: string) => (
        <Avatar
          size={40}
          src={avatar}
          style={{ backgroundColor: '#f0f0f0' }}
        />
      ),
    },
    {
      title: 'Audit Status',
      dataIndex: 'auditStatus',
      key: 'auditStatus',
      render: (status: string) => (
        <Tag color={statusColorMap[status] || 'default'}>{status}</Tag>
      ),
    },
    {
      title: 'Audit Reason',
      dataIndex: 'auditReason',
      key: 'auditReason',
      render: (reason: string) => reason || '-',
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: (
        <span style={{ cursor: 'pointer', userSelect: 'none' }} onClick={toggleSort}>
          Trust值{' '}
          <span style={{ fontSize: 12, color: sortDirection ? '#1890ff' : '#999' }}>
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
      render: (value: number, record: Actor) => {
        const isEditing = editingTrustId === record.id;
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
                onClick={() => saveEditingTrust(record.id)}
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
      title: 'Created at',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Badge',
      dataIndex: 'badge',
      key: 'badge',
      render: (badge: string) => (
        <Tag color={badgeColorMap[badge] || 'default'} style={{ borderRadius: 12 }}>
          {badge}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 140,
      render: (_: unknown, record: Actor) => (
        <Button type="primary" size="small" onClick={() => handleSetBadge(record)}>
          Set Badge
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>Actor List</Title>

      <div
        style={{
          display: 'flex',
          gap: 12,
          marginBottom: 16,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <Select
          placeholder="Audit Status"
          value={auditStatusFilter}
          onChange={(value) => {
            setAuditStatusFilter(value);
            setCurrentPage(1);
          }}
          allowClear
          style={{ width: 180 }}
          options={AUDIT_STATUS_OPTIONS.map((s) => ({ label: s, value: s }))}
        />
        <Input
          placeholder="ID"
          value={idFilter}
          onChange={(e) => {
            setIdFilter(e.target.value);
            setCurrentPage(1);
          }}
          allowClear
          style={{ width: 200 }}
        />
        <Input
          placeholder="Actor"
          value={actorNameFilter}
          onChange={(e) => {
            setActorNameFilter(e.target.value);
            setCurrentPage(1);
          }}
          allowClear
          style={{ width: 200 }}
        />
        <Button type="primary" icon={<SearchOutlined />} onClick={() => setCurrentPage(1)}>
          Search
        </Button>
        <Button icon={<ReloadOutlined />} onClick={handleReset}>
          Reset
        </Button>
      </div>

      <Table<Actor>
        columns={columns}
        dataSource={filteredActors}
        rowKey="id"
        bordered
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: filteredActors.length,
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

      <SetBadgeModal
        open={badgeModalOpen}
        actorName={selectedActor ? `${selectedActor.name}（${selectedActor.englishName}）` : ''}
        currentBadge={selectedActor?.badge || 'Community Actor'}
        onConfirm={handleBadgeConfirm}
        onCancel={handleBadgeCancel}
      />
    </div>
  );
};

export default ActorList;