import React from 'react';
import { Layout, Menu, Breadcrumb, Avatar, Badge, Dropdown, Typography } from 'antd';
import { UserOutlined, BellOutlined, HomeOutlined } from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const topNavItems = [
  { key: 'home', label: 'Home' },
  { key: 'dramas', label: 'Dramas' },
  { key: 'users', label: 'Users' },
  { key: 'financial', label: 'Financial Management' },
  { key: 'system', label: 'System Management' },
];

const sidebarItems = {
  dramas: [
    { key: '/dramas/actor-list', label: 'Actor List' },
    { key: '/dramas/mining-weekly-rewards', label: 'Mining Weekly Rewards' },
    { key: '/dramas/drama-list', label: 'Drama List' },
    { key: '/dramas/client-banner', label: 'Client Banner' },
  ],
};

const breadcrumbMap: Record<string, string> = {
  '/dramas/actor-list': 'ActorList',
  '/dramas/mining-weekly-rewards': 'Mining Weekly Rewards',
  '/dramas/drama-list': 'DramaList',
  '/dramas/client-banner': 'ClientBanner',
};

const getBreadcrumbItems = (pathname: string, navigateFn: (path: string) => void) => {
  const isDetailPage = pathname.startsWith('/dramas/mining-weekly-rewards/') && pathname !== '/dramas/mining-weekly-rewards';
  
  if (isDetailPage) {
    return [
      { title: <><HomeOutlined /> Home</> },
      { title: 'Dramas' },
      { title: <a onClick={() => navigateFn('/dramas/mining-weekly-rewards')}>Mining Weekly Rewards</a> },
      { title: 'Detail' },
    ];
  }
  
  const pageName = breadcrumbMap[pathname] || '';
  if (pageName) {
    return [
      { title: <><HomeOutlined /> Home</> },
      { title: 'Dramas' },
      { title: pageName },
    ];
  }
  
  return [];
};

const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [topNavActive, setTopNavActive] = React.useState('dramas');

  const handleTopNavClick = (key: string) => {
    setTopNavActive(key);
    if (key === 'home') {
      navigate('/');
    } else if (key === 'dramas') {
      navigate('/dramas/actor-list');
    } else if (key === 'users') {
      navigate('/users');
    }
  };

  const currentSidebarKey = location.pathname;
  const pageName = breadcrumbMap[currentSidebarKey] || '';
  const isUsersPage = location.pathname.startsWith('/users');

  React.useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/users')) {
      setTopNavActive('users');
    } else if (path.startsWith('/dramas')) {
      setTopNavActive('dramas');
    } else if (path === '/') {
      setTopNavActive('home');
    }
  }, [location.pathname]);

  const breadcrumbItems = getBreadcrumbItems(location.pathname, navigate);

  const userMenuItems = [
    { key: 'profile', label: 'Profile' },
    { key: 'logout', label: 'Logout' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#001529',
          padding: '0 24px',
          height: 56,
          lineHeight: '56px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 48, flex: 1, minWidth: 0 }}>
          <Text strong style={{ color: '#fff', fontSize: 18, whiteSpace: 'nowrap', flexShrink: 0 }}>
            OneStory Admin
          </Text>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[topNavActive]}
            items={topNavItems}
            onClick={({ key }) => handleTopNavClick(key)}
            style={{ background: 'transparent', borderBottom: 'none', minWidth: 600, flexShrink: 0 }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
          <Badge count={3} size="small">
            <BellOutlined style={{ color: '#fff', fontSize: 18, cursor: 'pointer' }} />
          </Badge>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Avatar
              size={32}
              icon={<UserOutlined />}
              style={{ cursor: 'pointer', backgroundColor: '#1890ff' }}
            />
          </Dropdown>
        </div>
      </Header>
      <Layout>
        <Sider
          width={200}
          style={{
            background: '#fff',
            borderRight: '1px solid #f0f0f0',
          }}
        >
          {topNavActive === 'dramas' && (
            <Menu
              mode="inline"
              selectedKeys={[currentSidebarKey]}
              items={sidebarItems.dramas}
              onClick={({ key }) => navigate(key)}
              style={{ borderRight: 'none', height: '100%' }}
            />
          )}
        </Sider>
        <Layout style={{ padding: '0 16px 16px' }}>
          <Breadcrumb
            items={breadcrumbItems}
            style={{ margin: '12px 0' }}
          />
          <Content
            style={{
              background: '#fff',
              padding: 24,
              borderRadius: 8,
              minHeight: 280,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AppLayout;