import React, { useState, useMemo } from 'react';
import {
  Table,
  Button,
  Tag,
  Modal,
  message,
} from 'antd';
import {
  EyeOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';

interface MiningPeriod {
  id: string;
  week: number;
  range: string;
  users: number;
  amount: number;
  status: 'pending' | 'approved';
  autoRelease: string;
  approvedTime: string;
}

const mockPeriods: MiningPeriod[] = [
  { id: '1', week: 22, range: '06/09 ~ 06/15', users: 128, amount: 1852300, status: 'pending', autoRelease: '06/18 15:00', approvedTime: '' },
  { id: '2', week: 21, range: '06/02 ~ 06/08', users: 156, amount: 2102900, status: 'approved', autoRelease: '06/11 15:00', approvedTime: '06/10 14:32' },
  { id: '3', week: 20, range: '05/26 ~ 06/01', users: 142, amount: 1987600, status: 'approved', autoRelease: '06/04 15:00', approvedTime: '06/03 09:17' },
  { id: '4', week: 19, range: '05/19 ~ 05/25', users: 115, amount: 1754000, status: 'approved', autoRelease: '05/28 15:00', approvedTime: '05/28 10:45' },
  { id: '5', week: 18, range: '05/12 ~ 05/18', users: 168, amount: 2117300, status: 'approved', autoRelease: '05/21 15:00', approvedTime: '05/21 08:30' },
  { id: '6', week: 17, range: '05/05 ~ 05/11', users: 134, amount: 1921500, status: 'pending', autoRelease: '05/14 15:00', approvedTime: '' },
  { id: '7', week: 16, range: '04/28 ~ 05/04', users: 127, amount: 1884200, status: 'approved', autoRelease: '05/07 15:00', approvedTime: '05/06 16:22' },
  { id: '8', week: 15, range: '04/21 ~ 04/27', users: 172, amount: 2131700, status: 'approved', autoRelease: '04/30 15:00', approvedTime: '04/30 14:08' },
  { id: '9', week: 14, range: '04/14 ~ 04/20', users: 119, amount: 2011300, status: 'approved', autoRelease: '04/23 15:00', approvedTime: '04/22 11:35' },
  { id: '10', week: 13, range: '04/07 ~ 04/13', users: 108, amount: 1896400, status: 'pending', autoRelease: '04/16 15:00', approvedTime: '' },
  { id: '11', week: 12, range: '03/31 ~ 04/06', users: 161, amount: 2146100, status: 'approved', autoRelease: '04/09 15:00', approvedTime: '04/08 13:50' },
  { id: '12', week: 11, range: '03/24 ~ 03/30', users: 145, amount: 1968200, status: 'approved', autoRelease: '04/02 15:00', approvedTime: '04/01 09:12' },
  { id: '13', week: 10, range: '03/17 ~ 03/23', users: 178, amount: 2155700, status: 'approved', autoRelease: '03/26 15:00', approvedTime: '03/25 17:40' },
  { id: '14', week: 9,  range: '03/10 ~ 03/16', users: 98,  amount: 1789300, status: 'approved', autoRelease: '03/19 15:00', approvedTime: '03/18 10:05' },
  { id: '15', week: 8,  range: '03/03 ~ 03/09', users: 132, amount: 2038200, status: 'approved', autoRelease: '03/12 15:00', approvedTime: '03/11 15:30' },
  { id: '16', week: 7,  range: '02/24 ~ 03/02', users: 155, amount: 2170100, status: 'approved', autoRelease: '03/05 15:00', approvedTime: '03/04 08:55' },
  { id: '17', week: 6,  range: '02/17 ~ 02/23', users: 111, amount: 1857600, status: 'approved', autoRelease: '02/26 15:00', approvedTime: '02/25 14:20' },
  { id: '18', week: 5,  range: '02/10 ~ 02/16', users: 124, amount: 1924500, status: 'approved', autoRelease: '02/19 15:00', approvedTime: '02/18 11:48' },
  { id: '19', week: 4,  range: '02/03 ~ 02/09', users: 166, amount: 2184500, status: 'approved', autoRelease: '02/12 15:00', approvedTime: '02/11 09:33' },
  { id: '20', week: 3,  range: '01/27 ~ 02/02', users: 87,  amount: 1748200, status: 'approved', autoRelease: '02/05 15:00', approvedTime: '02/04 16:15' },
  { id: '21', week: 2,  range: '01/20 ~ 01/26', users: 153, amount: 2194100, status: 'approved', autoRelease: '01/29 15:00', approvedTime: '01/28 10:00' },
  { id: '22', week: 1,  range: '01/13 ~ 01/19', users: 136, amount: 2034700, status: 'approved', autoRelease: '01/22 15:00', approvedTime: '01/21 13:42' },
];

const PAGE_SIZE = 10;

// Number formatter: 1,852,300 → 1.9M, 2,102,900 → 2.1M, etc.
function fmtAmount(n: number): string {
  if (n >= 1000000000) return (n / 1000000000).toFixed(2) + 'B';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n.toLocaleString();
}

const MiningWeeklyRewardsList: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [periods, setPeriods] = useState<MiningPeriod[]>(() => mockPeriods.map((p) => ({ ...p })));
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [approvingPeriod, setApprovingPeriod] = useState<MiningPeriod | null>(null);

  const handleViewDetail = (period: MiningPeriod) => {
    navigate(`/dramas/mining-weekly-rewards/${period.week}`);
  };

  const handleApprove = (period: MiningPeriod) => {
    setApprovingPeriod(period);
    setApproveModalVisible(true);
  };

  const confirmApprove = () => {
    if (!approvingPeriod) return;

    setPeriods((prev) =>
      prev.map((p) =>
        p.id === approvingPeriod.id
          ? {
              ...p,
              status: 'approved' as const,
              approvedTime: new Date().toLocaleString('zh-CN', {
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              }).replace(' ', ' '),
            }
          : p
      )
    );

    const period = approvingPeriod;
    message.success(`✅ ${period.range} 已放行，共 ${fmtAmount(period.amount)} STORY`);
    setApproveModalVisible(false);
    setApprovingPeriod(null);
  };

  // Calculate pagination
  const totalPages = Math.ceil(periods.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pageData = periods.slice(startIndex, startIndex + PAGE_SIZE);

  const columns: ColumnsType<MiningPeriod> = [
    {
      title: '周期',
      dataIndex: 'range',
      key: 'range',
      width: 180,
      render: (range: string) => <strong>{range}</strong>,
    },
    {
      title: '用户数',
      dataIndex: 'users',
      key: 'users',
      width: 100,
    },
    {
      title: '实际产出 (STORY)',
      dataIndex: 'amount',
      key: 'amount',
      width: 150,
      render: (value: number) => (
        <span style={{ fontWeight: 600, color: '#00b388' }}>{fmtAmount(value)}</span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        if (status === 'pending') {
          return <Tag color="orange" style={{ borderRadius: 999, padding: '2px 12px', fontSize: '0.78rem' }}>结算中</Tag>;
        }
        return <Tag color="green" style={{ borderRadius: 999, padding: '2px 12px', fontSize: '0.78rem' }}>已放行</Tag>;
      },
    },
    {
      title: '自动放行期限',
      dataIndex: 'autoRelease',
      key: 'autoRelease',
      width: 140,
      render: (value: string, record: MiningPeriod) => (
        <span style={{ color: record.status === 'pending' ? 'inherit' : '#8b8d98', fontSize: '0.85rem' }}>
          {value}
        </span>
      ),
    },
    {
      title: '放行时间',
      dataIndex: 'approvedTime',
      key: 'approvedTime',
      width: 140,
      render: (value: string) => {
        if (value) {
          return <span style={{ color: '#00b388', fontSize: '0.85rem' }}>{value}</span>;
        }
        return <span style={{ color: '#8b8d98', fontSize: '0.85rem' }}>--</span>;
      },
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      render: (_: unknown, record: MiningPeriod) => {
        if (record.status === 'pending') {
          return (
            <Button
              type="primary"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleApprove(record);
              }}
              style={{
                borderRadius: 999,
                background: '#00b388',
                borderColor: '#00b388',
                fontSize: '0.78rem',
                fontWeight: 600,
                padding: '4px 16px',
                height: 'auto',
                lineHeight: '22px',
              }}
            >
              放行
            </Button>
          );
        }
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 16px',
              borderRadius: 999,
              border: '1px solid #00b388',
              color: '#00b388',
              background: 'rgba(0,179,136,0.10)',
              fontSize: '0.78rem',
              fontWeight: 600,
              lineHeight: '22px',
            }}
          >
            ✓ 已放行
          </span>
        );
      },
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24, fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.015em' }}>
        ⛏️ 挖矿结算管理
      </h2>

      <div
        style={{
          background: '#fff',
          border: '1px solid #deeaf7',
          borderRadius: 16,
          padding: 24,
          boxShadow: '0 2px 8px rgba(27,45,71,0.04)',
        }}
      >
        <Table<MiningPeriod>
          columns={columns}
          dataSource={pageData}
          rowKey="id"
          bordered={false}
          pagination={false}
          onRow={(record) => ({
            onClick: () => handleViewDetail(record),
            style: { cursor: 'pointer' },
            onMouseEnter: (e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#f8fbfe';
            },
            onMouseLeave: (e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '';
            },
          })}
          style={{ borderRadius: 8, overflow: 'hidden' }}
        />

        {totalPages > 1 && (
          <div
            style={{
              display: 'flex',
              gap: 8,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 16,
            }}
          >
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              style={{
                padding: '6px 16px',
                border: '1px solid #deeaf7',
                borderRadius: 999,
                background: '#fff',
                color: currentPage <= 1 ? '#bbb' : '#5e6f83',
                fontSize: '0.82rem',
                fontWeight: 500,
                cursor: currentPage <= 1 ? 'default' : 'pointer',
                transition: 'all 0.15s',
                outline: 'none',
              }}
            >
              ← 上一页
            </button>
            <span style={{ fontSize: '0.82rem', color: '#8b8d98' }}>
              第 {currentPage} / {totalPages} 页
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              style={{
                padding: '6px 16px',
                border: '1px solid #deeaf7',
                borderRadius: 999,
                background: '#fff',
                color: currentPage >= totalPages ? '#bbb' : '#5e6f83',
                fontSize: '0.82rem',
                fontWeight: 500,
                cursor: currentPage >= totalPages ? 'default' : 'pointer',
                transition: 'all 0.15s',
                outline: 'none',
              }}
            >
              下一页 →
            </button>
          </div>
        )}
      </div>

      <Modal
        title={null}
        open={approveModalVisible}
        onCancel={() => {
          setApproveModalVisible(false);
          setApprovingPeriod(null);
        }}
        footer={null}
        closable={false}
        width={420}
        centered
        destroyOnClose
        styles={{
          content: {
            borderRadius: 16,
            padding: '28px 32px',
            boxShadow: '0 20px 60px rgba(27,45,71,0.2)',
          },
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>确认放行周期</h3>
          <button
            onClick={() => {
              setApproveModalVisible(false);
              setApprovingPeriod(null);
            }}
            style={{
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              background: 'rgba(0,0,0,0.04)',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '1.2rem',
              color: '#5e6f83',
              transition: 'background 0.15s',
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: '0.88rem', color: '#5e6f83', lineHeight: 1.6, marginBottom: 12 }}>
            确认放行周期 <strong style={{ fontWeight: 700, color: '#13202e' }}>{approvingPeriod?.range}</strong> 的挖矿结算？
          </p>
          <p style={{ fontSize: '0.88rem', color: '#5e6f83', lineHeight: 1.6, marginBottom: 12 }}>
            放行后该周期内所有用户的收益将进入可领取状态。
          </p>
          <p style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
            <span>总金额：</span>
            <strong style={{ fontWeight: 700, color: '#13202e' }}>{fmtAmount(approvingPeriod?.amount || 0)} STORY</strong>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            onClick={() => {
              setApproveModalVisible(false);
              setApprovingPeriod(null);
            }}
            style={{
              padding: '10px 24px',
              borderRadius: 999,
              border: '1px solid #deeaf7',
              background: '#fff',
              color: '#5e6f83',
              fontSize: '0.88rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            取消
          </button>
          <button
            onClick={confirmApprove}
            style={{
              padding: '10px 24px',
              borderRadius: 999,
              border: 'none',
              background: '#00b388',
              color: '#fff',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            确认放行
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default MiningWeeklyRewardsList;