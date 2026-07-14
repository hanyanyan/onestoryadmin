import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  Select,
  Button,
  Tag,
  Input,
  Space,
  Modal,
  message,
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface MiningReward {
  id: string;
  periodId: string;
  userId: string;
  rewardType: 'Earnings' | 'Invite Earnings';
  system: string;
  actualOutput: number;
  fromUserId: string | number;
  auditStatus: 'Pending' | 'Audited';
  auditor: string;
  auditRemark: string;
  auditedAt: string;
  createdAt: string;
}

const mockMiningRewards: MiningReward[] = [
  {
    id: '1',
    periodId: 'WP-2026-28',
    userId: '427669209656590336',
    rewardType: 'Earnings',
    system: 'Dispatch',
    actualOutput: 0,
    fromUserId: 41.75,
    auditStatus: 'Audited',
    auditor: 'SYSTEM',
    auditRemark: 'batchApprove',
    auditedAt: '2026-07-14 14:53:55',
    createdAt: '2026-07-13 18:00:00',
  },
  {
    id: '2',
    periodId: 'WP-2026-28',
    userId: '427669209656590336',
    rewardType: 'Earnings',
    system: 'Dispatch',
    actualOutput: 0,
    fromUserId: 88.25,
    auditStatus: 'Audited',
    auditor: 'SYSTEM',
    auditRemark: 'batchApprove',
    auditedAt: '2026-07-14 14:54:22',
    createdAt: '2026-07-13 18:00:00',
  },
  {
    id: '3',
    periodId: 'WP-2026-28',
    userId: '427669209656590336',
    rewardType: 'Earnings',
    system: 'Dispatch',
    actualOutput: 0,
    fromUserId: 126.5,
    auditStatus: 'Audited',
    auditor: 'SYSTEM',
    auditRemark: 'batchApprove',
    auditedAt: '2026-07-14 14:55:25',
    createdAt: '2026-07-13 18:00:00',
  },
  {
    id: '4',
    periodId: 'WP-2026-28',
    userId: '427669209656590336',
    rewardType: 'Invite Earnings',
    system: '-',
    actualOutput: 380,
    fromUserId: '430200786077212672',
    auditStatus: 'Audited',
    auditor: 'SYSTEM',
    auditRemark: '1',
    auditedAt: '2026-07-14 13:48:53',
    createdAt: '2026-07-13 08:00:00',
  },
  {
    id: '5',
    periodId: 'WP-2026-28',
    userId: '427669209656590336',
    rewardType: 'Earnings',
    system: 'Dispatch',
    actualOutput: 0,
    fromUserId: 740,
    auditStatus: 'Pending',
    auditor: '',
    auditRemark: '',
    auditedAt: '',
    createdAt: '2026-07-13 08:00:00',
  },
  {
    id: '6',
    periodId: 'WP-2026-28',
    userId: '427669209656590336',
    rewardType: 'Earnings',
    system: 'Dispatch',
    actualOutput: 0,
    fromUserId: 860,
    auditStatus: 'Pending',
    auditor: '',
    auditRemark: '',
    auditedAt: '',
    createdAt: '2026-07-13 08:00:00',
  },
  {
    id: '7',
    periodId: 'WP-2026-28',
    userId: '427624421473386496',
    rewardType: 'Earnings',
    system: 'Dispatch',
    actualOutput: 1,
    fromUserId: 0.1056,
    auditStatus: 'Audited',
    auditor: 'SYSTEM',
    auditRemark: 'batchApprove',
    auditedAt: '2026-07-14 10:35:09',
    createdAt: '2026-07-13 08:00:00',
  },
];

const REWARD_TYPE_OPTIONS = [
  { label: 'Earnings', value: 'Earnings' },
  { label: 'Invite Earnings', value: 'Invite Earnings' },
  { label: 'All', value: 'All' },
];

const AUDIT_STATUS_OPTIONS = [
  { label: 'Pending', value: 'Pending' },
  { label: 'Audited', value: 'Audited' },
  { label: 'All', value: 'All' },
];

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

const MiningWeeklyRewards: React.FC = () => {
  const navigate = useNavigate();
  const [userIdFilter, setUserIdFilter] = useState('');
  const [rewardTypeFilter, setRewardTypeFilter] = useState<string | undefined>(undefined);
  const [auditStatusFilter, setAuditStatusFilter] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [rewards, setRewards] = useState<MiningReward[]>(() => mockMiningRewards.map((r) => ({ ...r })));
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [selectedRewardId, setSelectedRewardId] = useState<string | null>(null);
  const [releaseAction, setReleaseAction] = useState<'approve' | 'reject' | null>(null);

  const filteredRewards = useMemo(() => {
    let result = [...rewards];

    if (userIdFilter) {
      result = result.filter((r) => r.userId.includes(userIdFilter));
    }
    if (rewardTypeFilter && rewardTypeFilter !== 'All') {
      result = result.filter((r) => r.rewardType === rewardTypeFilter);
    }
    if (auditStatusFilter && auditStatusFilter !== 'All') {
      result = result.filter((r) => r.auditStatus === auditStatusFilter);
    }

    return result;
  }, [rewards, userIdFilter, rewardTypeFilter, auditStatusFilter]);

  const handleReset = () => {
    setUserIdFilter('');
    setRewardTypeFilter(undefined);
    setAuditStatusFilter(undefined);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleViewDetail = (periodId: string) => {
    navigate(`/dramas/mining-weekly-rewards/${periodId}`);
  };

  const handleApprove = (rewardId: string) => {
    setSelectedRewardId(rewardId);
    setReleaseAction('approve');
    setApproveModalVisible(true);
  };

  const handleReject = (rewardId: string) => {
    setSelectedRewardId(rewardId);
    setReleaseAction('reject');
    setRejectModalVisible(true);
  };

  const confirmApprove = () => {
    if (!selectedRewardId) return;
    
    setRewards((prev) =>
      prev.map((r) =>
        r.id === selectedRewardId
          ? {
              ...r,
              auditStatus: 'Audited' as const,
              auditor: 'SYSTEM',
              auditRemark: 'batchApprove',
              auditedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
            }
          : r
      )
    );
    message.success('Approved successfully');
    setApproveModalVisible(false);
    setSelectedRewardId(null);
    setReleaseAction(null);
  };

  const confirmReject = () => {
    if (!selectedRewardId) return;
    
    setRewards((prev) =>
      prev.map((r) =>
        r.id === selectedRewardId
          ? {
              ...r,
              auditStatus: 'Audited' as const,
              auditor: 'SYSTEM',
              auditRemark: 'batchReject',
              auditedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
            }
          : r
      )
    );
    message.success('Rejected successfully');
    setRejectModalVisible(false);
    setSelectedRewardId(null);
    setReleaseAction(null);
  };

  const columns: ColumnsType<MiningReward> = [
    {
      title: 'No.',
      width: 70,
      render: (_: unknown, __: unknown, index: number) => {
        return (currentPage - 1) * pageSize + index + 1;
      },
    },
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: 'Reward Type',
      dataIndex: 'rewardType',
      key: 'rewardType',
      render: (type: string) => <Tag color={type === 'Earnings' ? 'blue' : 'purple'}>{type}</Tag>,
    },
    {
      title: 'System',
      dataIndex: 'system',
      key: 'system',
      render: (system: string) => system || '-',
    },
    {
      title: 'Actual Output',
      dataIndex: 'actualOutput',
      key: 'actualOutput',
      render: (value: number) => value.toFixed(4),
    },
    {
      title: 'From User ID',
      dataIndex: 'fromUserId',
      key: 'fromUserId',
      render: (value: string | number) => {
        if (typeof value === 'number') {
          return value.toFixed(4);
        }
        return value;
      },
    },
    {
      title: 'Audit Status',
      dataIndex: 'auditStatus',
      key: 'auditStatus',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          Audited: 'green',
          Pending: 'orange',
        };
        return <Tag color={colorMap[status] || 'default'}>{status}</Tag>;
      },
    },
    {
      title: 'Auditor',
      dataIndex: 'auditor',
      key: 'auditor',
    },
    {
      title: 'Audit Remark',
      dataIndex: 'auditRemark',
      key: 'auditRemark',
    },
    {
      title: 'Audited At',
      dataIndex: 'auditedAt',
      key: 'auditedAt',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_: unknown, record: MiningReward) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record.periodId)}
          >
            Detail
          </Button>
          <Button
            type="link"
            size="small"
            icon={<CheckOutlined />}
            onClick={() => handleApprove(record.id)}
            disabled={record.auditStatus !== 'Pending'}
            style={{ color: '#52c41a' }}
          >
            Approve
          </Button>
          <Button
            type="link"
            size="small"
            icon={<CloseOutlined />}
            onClick={() => handleReject(record.id)}
            disabled={record.auditStatus !== 'Pending'}
            danger
          >
            Reject
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16, fontSize: 20, fontWeight: 500 }}>Mining Weekly Rewards</h2>

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
          placeholder="请输入用户ID"
          value={userIdFilter}
          onChange={(e) => {
            setUserIdFilter(e.target.value);
            setCurrentPage(1);
          }}
          allowClear
          style={{ width: 200 }}
        />
        <Select
          placeholder="Reward Type"
          value={rewardTypeFilter}
          onChange={(value) => {
            setRewardTypeFilter(value);
            setCurrentPage(1);
          }}
          allowClear
          style={{ width: 180 }}
          options={REWARD_TYPE_OPTIONS}
        />
        <Select
          placeholder="Audit Status"
          value={auditStatusFilter}
          onChange={(value) => {
            setAuditStatusFilter(value);
            setCurrentPage(1);
          }}
          allowClear
          style={{ width: 180 }}
          options={AUDIT_STATUS_OPTIONS}
        />
        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
          Search
        </Button>
        <Button icon={<ReloadOutlined />} onClick={handleReset}>
          Reset
        </Button>
      </div>

      <Table<MiningReward>
        columns={columns}
        dataSource={filteredRewards}
        rowKey="id"
        bordered
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: filteredRewards.length,
          onChange: (page: number, size: number) => {
            setCurrentPage(page);
            if (size) setPageSize(size);
          },
          showTotal: (total: number) => `Total: ${total}`,
          showSizeChanger: true,
          pageSizeOptions: PAGE_SIZE_OPTIONS.map((size) => size.toString()),
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

      <Modal
        title="Confirm Approve"
        open={approveModalVisible}
        onOk={confirmApprove}
        onCancel={() => {
          setApproveModalVisible(false);
          setSelectedRewardId(null);
          setReleaseAction(null);
        }}
        okText="Confirm"
        cancelText="Cancel"
      >
        <p>Are you sure you want to approve this reward?</p>
      </Modal>

      <Modal
        title="Confirm Reject"
        open={rejectModalVisible}
        onOk={confirmReject}
        onCancel={() => {
          setRejectModalVisible(false);
          setSelectedRewardId(null);
          setReleaseAction(null);
        }}
        okText="Confirm"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to reject this reward?</p>
      </Modal>
    </div>
  );
};

export default MiningWeeklyRewards;