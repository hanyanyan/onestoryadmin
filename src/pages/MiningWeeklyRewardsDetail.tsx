import React, { useState, useCallback, useMemo } from 'react';
import {
  Table,
  Button,
  Tag,
  Input,
  InputNumber,
  Modal,
  message,
  Drawer,
  Descriptions,
} from 'antd';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  CheckOutlined,
  SearchOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useParams, useNavigate } from 'react-router-dom';

interface MiningRewardDetail {
  id: string;
  periodId: string;
  userId: string;
  rewardType: 'Earnings' | 'Invite Earnings';
  system: string;
  actualOutput: number;
  originalOutput: number;
  fromUserId: string;
  auditStatus: 'Pending' | 'Audited' | 'Rejected';
  auditor: string;
  auditRemark: string;
  auditedAt: string;
  createdAt: string;
}

interface ChangeLog {
  id: string;
  modifiedAt: string;
  operator: string;
  oldValue: number;
  newValue: number;
  remark: string;
}

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

const mockDetails: MiningRewardDetail[] = [
  { id: '1', periodId: 'WP-2026-28', userId: '427669209656590336', rewardType: 'Earnings', system: 'Dispatch', actualOutput: 12580.5, originalOutput: 12580.5, fromUserId: '', auditStatus: 'Audited', auditor: 'SYSTEM', auditRemark: 'batchApprove', auditedAt: '2026-07-14 14:53:55', createdAt: '2026-07-13 18:00:00' },
  { id: '2', periodId: 'WP-2026-28', userId: '427669209656590336', rewardType: 'Earnings', system: 'Dispatch', actualOutput: 8320.25, originalOutput: 8320.25, fromUserId: '', auditStatus: 'Audited', auditor: 'SYSTEM', auditRemark: 'batchApprove', auditedAt: '2026-07-14 14:54:22', createdAt: '2026-07-13 18:00:00' },
  { id: '3', periodId: 'WP-2026-28', userId: '427669209656590336', rewardType: 'Earnings', system: 'Dispatch', actualOutput: 15630.75, originalOutput: 15630.75, fromUserId: '', auditStatus: 'Audited', auditor: 'SYSTEM', auditRemark: 'batchApprove', auditedAt: '2026-07-14 14:55:25', createdAt: '2026-07-13 18:00:00' },
  { id: '4', periodId: 'WP-2026-28', userId: '427669209656590336', rewardType: 'Invite Earnings', system: '-', actualOutput: 380.5, originalOutput: 380.5, fromUserId: '430200786077212672', auditStatus: 'Audited', auditor: 'SYSTEM', auditRemark: '1', auditedAt: '2026-07-14 13:48:53', createdAt: '2026-07-13 08:00:00' },
  { id: '5', periodId: 'WP-2026-28', userId: '427669209656590336', rewardType: 'Earnings', system: 'Dispatch', actualOutput: 21450.0, originalOutput: 21450.0, fromUserId: '', auditStatus: 'Audited', auditor: 'SYSTEM', auditRemark: 'batchApprove', auditedAt: '2026-07-14 13:50:26', createdAt: '2026-07-13 08:00:00' },
  { id: '6', periodId: 'WP-2026-28', userId: '427669209656590336', rewardType: 'Earnings', system: 'Dispatch', actualOutput: 9870.3, originalOutput: 9870.3, fromUserId: '', auditStatus: 'Audited', auditor: 'SYSTEM', auditRemark: 'batchApprove', auditedAt: '2026-07-14 13:51:06', createdAt: '2026-07-13 08:00:00' },
  { id: '7', periodId: 'WP-2026-28', userId: '427624421473386496', rewardType: 'Earnings', system: 'Dispatch', actualOutput: 18560.0, originalOutput: 18560.0, fromUserId: '', auditStatus: 'Audited', auditor: 'SYSTEM', auditRemark: 'batchReject', auditedAt: '2026-07-14 10:35:09', createdAt: '2026-07-13 08:00:00' },
];

const mockChangeLogs: ChangeLog[] = [
  { id: '1', modifiedAt: '2026-07-14 14:53:55', operator: 'admin', oldValue: 12580.5, newValue: 12000.0, remark: '手动调整' },
  { id: '2', modifiedAt: '2026-07-14 14:54:22', operator: 'admin', oldValue: 8320.25, newValue: 8000.0, remark: '手动调整' },
];

function fmtAmount(n: number): string {
  if (n >= 1000000000) return (n / 1000000000).toFixed(2) + 'B';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n.toLocaleString();
}

const REWARD_TYPE_LABEL: Record<string, string> = {
  Earnings: '质押挖矿',
  'Invite Earnings': '邀请挖矿',
};

const RELEASE_STATUS_LABEL: Record<string, string> = {
  Released: '已放行',
  Pending: '未放行',
  Rejected: '已驳回',
};

const RELEASE_STATUS_COLOR: Record<string, string> = {
  Released: 'green',
  Pending: 'orange',
  Rejected: 'red',
};

const MINING_WEEKLY_REWARDS_PATH = '/dramas/mining-weekly-rewards';

const MiningWeeklyRewardsDetail: React.FC = () => {
  const { periodId } = useParams<{ periodId: string }>();
  const navigate = useNavigate();

  const periodFromList = useMemo(() => {
    const weekNum = parseInt(periodId || '0', 10);
    return mockPeriods.find((p) => p.week === weekNum) || null;
  }, [periodId]);

  const periodStatus = periodFromList?.status === 'approved' ? 'Released' : 'Pending';
  const isReleased = periodStatus === 'Released';
  const periodRange = periodFromList?.range || `Week ${periodId}`;

  const [details, setDetails] = useState<MiningRewardDetail[]>(() =>
    [...mockDetails].sort((a, b) => b.actualOutput - a.actualOutput)
  );
  const [changeLogs, setChangeLogs] = useState<ChangeLog[]>(mockChangeLogs);
  const [logDrawerVisible, setLogDrawerVisible] = useState(false);
  const [selectedDetailId, setSelectedDetailId] = useState<string | null>(null);
  const [releaseModalVisible, setReleaseModalVisible] = useState(false);
  const [userIdFilter, setUserIdFilter] = useState('');

  const filteredDetails = useMemo(() => {
    let result = [...details];
    if (userIdFilter) {
      result = result.filter((d) => d.userId.includes(userIdFilter));
    }
    result.sort((a, b) => b.actualOutput - a.actualOutput);
    return result;
  }, [details, userIdFilter]);

  const handleActualOutputChange = useCallback((detailId: string, newValue: number) => {
    if (isReleased) return;

    const detail = details.find((d) => d.id === detailId);
    if (!detail) return;

    if (newValue > detail.originalOutput) {
      message.error('不能大于当前值');
      return;
    }

    setDetails((prev) =>
      prev.map((d) =>
        d.id === detailId ? { ...d, actualOutput: newValue } : d
      )
    );
  }, [isReleased, details]);

  const handleViewLog = (detailId: string) => {
    setSelectedDetailId(detailId);
    setLogDrawerVisible(true);
  };

  const handleSave = () => {
    const hasInvalid = details.some((d) => d.actualOutput > d.originalOutput);
    if (hasInvalid) {
      message.error('部分数值无效，请检查后重试');
      return;
    }

    const newLogs: ChangeLog[] = details
      .filter((d) => d.actualOutput !== d.originalOutput)
      .map((d) => ({
        id: d.id,
        modifiedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
        operator: 'admin',
        oldValue: d.originalOutput,
        newValue: d.actualOutput,
        remark: '手动调整',
      }));

    if (newLogs.length === 0) {
      message.info('没有需要保存的修改');
      return;
    }

    setChangeLogs((prev) => [...newLogs, ...prev]);
    message.success('保存成功');
  };

  const handleRelease = () => {
    setReleaseModalVisible(true);
  };

  const confirmRelease = () => {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    setDetails((prev) =>
      prev.map((d) => ({
        ...d,
        auditor: 'admin',
        auditedAt: now,
      }))
    );
    setReleaseModalVisible(false);
    message.success('放行成功');
  };

  const releaseStatus = periodStatus;
  const isPeriodPending = !isReleased;

  const columns: ColumnsType<MiningRewardDetail> = [
    {
      title: '序号',
      width: 70,
      render: (_: unknown, __: unknown, index: number) => {
        return index + 1;
      },
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: '奖励类型',
      dataIndex: 'rewardType',
      key: 'rewardType',
      render: (type: string) => (
        <Tag
          color={type === 'Earnings' ? 'blue' : 'purple'}
          style={{ borderRadius: 999, padding: '2px 12px', fontSize: '0.78rem' }}
        >
          {REWARD_TYPE_LABEL[type] || type}
        </Tag>
      ),
    },
    {
      title: '实际产出',
      dataIndex: 'actualOutput',
      key: 'actualOutput',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.actualOutput - b.actualOutput,
      render: (value: number, record: MiningRewardDetail) => {
        // 未放行 + 质押挖矿 → 可编辑
        const canEdit = !isReleased && record.rewardType === 'Earnings';
        if (canEdit) {
          return (
            <InputNumber
              value={value}
              onChange={(v) => {
                if (v !== null && v !== undefined) {
                  handleActualOutputChange(record.id, v);
                }
              }}
              min={0}
              max={record.originalOutput}
              step={0.0001}
              precision={4}
              style={{ width: 150 }}
            />
          );
        }
        return (
          <span style={{ fontWeight: 600, color: '#00b388' }}>
            {value.toFixed(4)}
          </span>
        );
      },
    },
    {
      title: '来源用户ID',
      dataIndex: 'fromUserId',
      key: 'fromUserId',
      render: (value: string) => {
        if (!value) return <span style={{ color: '#8b8d98' }}>--</span>;
        return <span>{value}</span>;
      },
    },
    {
      title: '放行状态',
      key: 'releaseStatus',
      render: () => (
        <Tag
          color={RELEASE_STATUS_COLOR[releaseStatus]}
          style={{ borderRadius: 999, padding: '2px 12px', fontSize: '0.78rem' }}
        >
          {RELEASE_STATUS_LABEL[releaseStatus]}
        </Tag>
      ),
    },
    {
      title: '放行人',
      key: 'releaser',
      render: (_: unknown, record: MiningRewardDetail) => {
        if (isPeriodPending) return <span style={{ color: '#8b8d98' }}>--</span>;
        return <span>{record.auditor || '--'}</span>;
      },
    },
    {
      title: '放行时间',
      key: 'releaseTime',
      render: (_: unknown, record: MiningRewardDetail) => {
        if (isPeriodPending) return <span style={{ color: '#8b8d98' }}>--</span>;
        return <span>{record.auditedAt || '--'}</span>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '操作日志',
      key: 'log',
      width: 120,
      render: (_: unknown, record: MiningRewardDetail) => (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewLog(record.id)}
          style={{ borderRadius: 999, fontSize: '0.78rem', padding: '2px 12px', height: 'auto' }}
        >
          查看日志
        </Button>
      ),
    },
  ];

  const statusColorMap: Record<string, string> = {
    Pending: 'orange',
    Released: 'green',
    Rejected: 'red',
  };

  const statusLabelMap: Record<string, string> = {
    Pending: '结算中',
    Released: '已放行',
    Rejected: '已驳回',
  };

  const drawerLogs = useMemo(() => {
    if (!selectedDetailId) return [];
    return changeLogs.filter((log) => log.id === selectedDetailId);
  }, [changeLogs, selectedDetailId]);

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(MINING_WEEKLY_REWARDS_PATH)}
          style={{
            borderRadius: 999,
            border: '1px solid #deeaf7',
            fontSize: '0.82rem',
            fontWeight: 500,
            height: 36,
            padding: '4px 18px',
          }}
        >
          返回
        </Button>
        <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.015em' }}>
          周期详情 – {periodRange}
        </h2>
      </div>

      <div
        style={{
          background: '#fff',
          border: '1px solid #deeaf7',
          borderRadius: 16,
          padding: 24,
          boxShadow: '0 2px 8px rgba(27,45,71,0.04)',
          marginBottom: 16,
        }}
      >
        <Descriptions
          title={
            <span style={{ fontSize: '1.05rem', fontWeight: 600, letterSpacing: '-0.01em', color: '#13202e' }}>
              周期概览
            </span>
          }
          column={4}
          style={{ borderRadius: 8 }}
          labelStyle={{ fontWeight: 500, color: '#5e6f83', fontSize: '0.85rem' }}
          contentStyle={{ fontSize: '0.88rem', color: '#13202e' }}
        >
          <Descriptions.Item label="周期">{periodRange}</Descriptions.Item>
          <Descriptions.Item label="用户数">
            <span style={{ fontWeight: 600 }}>{periodFromList?.users || 0}</span>
          </Descriptions.Item>
          <Descriptions.Item label="实际产出 (STORY)">
            <span style={{ fontWeight: 600, color: '#00b388' }}>
              {periodFromList?.amount ? fmtAmount(periodFromList.amount) : '0'}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag
              color={statusColorMap[periodStatus]}
              style={{ borderRadius: 999, padding: '2px 12px', fontSize: '0.78rem' }}
            >
              {statusLabelMap[periodStatus]}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="自动放行期限">
            <span style={{ color: periodFromList?.status === 'pending' ? 'inherit' : '#8b8d98', fontSize: '0.85rem' }}>
              {periodFromList?.autoRelease || '--'}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="放行时间">
            {periodFromList?.approvedTime ? (
              <span style={{ color: '#00b388', fontSize: '0.85rem' }}>{periodFromList.approvedTime}</span>
            ) : (
              <span style={{ color: '#8b8d98', fontSize: '0.85rem' }}>--</span>
            )}
          </Descriptions.Item>
        </Descriptions>
      </div>

      {/* 筛选框 + 操作按钮同行 */}
      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Input
          placeholder="用户ID"
          value={userIdFilter}
          onChange={(e) => setUserIdFilter(e.target.value)}
          allowClear
          prefix={<SearchOutlined style={{ color: '#8b8d98' }} />}
          style={{ width: 260, borderRadius: 999 }}
        />
        {!isReleased && (
          <div style={{ display: 'flex', gap: 10 }}>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSave}
              style={{
                borderRadius: 999,
                fontWeight: 600,
                fontSize: '0.82rem',
                padding: '4px 20px',
                height: 36,
              }}
            >
              保存
            </Button>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={handleRelease}
              style={{
                borderRadius: 999,
                fontWeight: 600,
                fontSize: '0.82rem',
                padding: '4px 20px',
                height: 36,
                background: '#00b388',
                borderColor: '#00b388',
              }}
            >
              放行
            </Button>
          </div>
        )}
      </div>

      <div
        style={{
          background: '#fff',
          border: '1px solid #deeaf7',
          borderRadius: 16,
          padding: 24,
          boxShadow: '0 2px 8px rgba(27,45,71,0.04)',
        }}
      >
        <Table<MiningRewardDetail>
          columns={columns}
          dataSource={filteredDetails}
          rowKey="id"
          bordered={false}
          pagination={false}
          onRow={() => ({
            style: { cursor: 'default' },
          })}
          style={{ borderRadius: 8, overflow: 'hidden' }}
        />
      </div>

      <Drawer
        title={
          <span style={{ fontSize: '1.05rem', fontWeight: 600, letterSpacing: '-0.01em', color: '#13202e' }}>
            变更日志
          </span>
        }
        placement="right"
        width={600}
        open={logDrawerVisible}
        onClose={() => setLogDrawerVisible(false)}
        styles={{
          header: {
            borderBottom: '1px solid #deeaf7',
            padding: '20px 24px',
          },
          body: {
            padding: 24,
          },
        }}
      >
        <div
          style={{
            background: '#fff',
            border: '1px solid #deeaf7',
            borderRadius: 16,
            padding: 16,
            boxShadow: '0 2px 8px rgba(27,45,71,0.04)',
          }}
        >
          <Table<ChangeLog>
            columns={[
              { title: '修改时间', dataIndex: 'modifiedAt', key: 'modifiedAt' },
              { title: '操作人', dataIndex: 'operator', key: 'operator' },
              { title: '旧值', dataIndex: 'oldValue', key: 'oldValue', render: (v: number) => v.toFixed(4) },
              { title: '新值', dataIndex: 'newValue', key: 'newValue', render: (v: number) => v.toFixed(4) },
              { title: '备注', dataIndex: 'remark', key: 'remark' },
            ]}
            dataSource={drawerLogs}
            rowKey="id"
            bordered={false}
            pagination={false}
            style={{ borderRadius: 8, overflow: 'hidden' }}
          />
        </div>
      </Drawer>

      <Modal
        title={null}
        open={releaseModalVisible}
        onCancel={() => setReleaseModalVisible(false)}
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
            onClick={() => setReleaseModalVisible(false)}
            style={{
              width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', background: 'rgba(0,0,0,0.04)', borderRadius: '50%',
              cursor: 'pointer', fontSize: '1.2rem', color: '#5e6f83', transition: 'background 0.15s',
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: '0.88rem', color: '#5e6f83', lineHeight: 1.6, marginBottom: 12 }}>
            确认放行周期 <strong style={{ fontWeight: 700, color: '#13202e' }}>{periodRange}</strong> 的挖矿结算？
          </p>
          <p style={{ fontSize: '0.88rem', color: '#5e6f83', lineHeight: 1.6, marginBottom: 12 }}>
            放行后该周期内所有用户的收益将进入可领取状态。
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={() => setReleaseModalVisible(false)} style={{ padding: '10px 24px', borderRadius: 999, border: '1px solid #deeaf7', background: '#fff', color: '#5e6f83', fontSize: '0.88rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s' }}>取消</button>
          <button onClick={confirmRelease} style={{ padding: '10px 24px', borderRadius: 999, border: 'none', background: '#00b388', color: '#fff', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>确认放行</button>
        </div>
      </Modal>
    </div>
  );
};

export default MiningWeeklyRewardsDetail;