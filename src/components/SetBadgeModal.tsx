import React from 'react';
import { Modal, Radio, Space } from 'antd';
import { BadgeType, BADGE_OPTIONS } from '../types';

interface SetBadgeModalProps {
  open: boolean;
  actorName: string;
  currentBadge: BadgeType;
  onConfirm: (badge: BadgeType) => void;
  onCancel: () => void;
}

const SetBadgeModal: React.FC<SetBadgeModalProps> = ({
  open,
  actorName,
  currentBadge,
  onConfirm,
  onCancel,
}) => {
  const [selectedBadge, setSelectedBadge] = React.useState<BadgeType>(currentBadge);

  React.useEffect(() => {
    setSelectedBadge(currentBadge);
  }, [currentBadge, open]);

  return (
    <Modal
      title="Set Badge"
      open={open}
      onOk={() => onConfirm(selectedBadge)}
      onCancel={onCancel}
      okText="Confirm"
      cancelText="Cancel"
    >
      <p style={{ marginBottom: 16 }}>
        Set badge for <strong>{actorName}</strong>:
      </p>
      <Radio.Group
        value={selectedBadge}
        onChange={(e) => setSelectedBadge(e.target.value)}
      >
        <Space direction="vertical">
          {BADGE_OPTIONS.map((badge) => (
            <Radio key={badge} value={badge}>
              {badge}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
    </Modal>
  );
};

export default SetBadgeModal;