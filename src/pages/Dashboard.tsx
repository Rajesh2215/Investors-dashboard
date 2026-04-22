import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { type User, logoutUser } from "../api/modules/auth";
import { getCurrentNav, streamNavUpdates } from "../api/modules/nav";
import { getHoldings, type Holding } from "../api/modules/holdings";
import { getAssets, type Asset } from "../api/modules/assets";
import { executeTrade } from "../api/modules/trade";
import {
  getTransactions,
  type TransactionWithAsset,
} from "../api/modules/transactions";
import { getAlerts, createAlert, deleteAlert, type Alert } from "../api/modules/alerts";
import NavCard from "../components/NavCard";
import HoldingsList from "../components/HoldingsList";
import AssetCard from "../components/AssetCard";
import TradeModal from "../components/TradeModal";
import TransactionsList from "../components/TransactionsList";
import NavHistoryChart from "../components/NavHistoryChart";
import AlertForm from "../components/AlertForm";
import AlertsList from "../components/AlertsList";
import AlertNotifications from "../components/AlertNotifications";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [nav, setNav] = useState<number>(0);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [transactions, setTransactions] = useState<TransactionWithAsset[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [streamAlerts, setStreamAlerts] = useState<Alert[]>([]);
  const [cryptoPrices, setCryptoPrices] = useState<
    Array<{ symbol: string; price: number }>
  >([]);
  const [navLoading, setNavLoading] = useState(true);
  const [holdingsLoading, setHoldingsLoading] = useState(true);
  const [assetsLoading, setAssetsLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [alertsLoading, setAlertsLoading] = useState(true);
  const [tradeModal, setTradeModal] = useState<{
    asset: Asset;
    type: "BUY" | "SELL";
  } | null>(null);
  const navigate = useNavigate();
  const eventSourceRef = useRef<{ close: () => void } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    // Check if token exists
    if (!token) {
      navigate("/login");
      return;
    }

    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      // Fetch initial data
      fetchDashboardData(parsedUser._id);
    } else {
      navigate("/login");
    }

    return () => {
      // Cleanup EventSource on unmount
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [navigate]);

  const fetchDashboardData = async (userId: string) => {
    try {
      // Set all loading states to true
      setNavLoading(true);
      setHoldingsLoading(true);
      setAssetsLoading(true);
      setTransactionsLoading(true);
      setAlertsLoading(true);

      // Fetch all data in parallel
      const [navData, holdingsData, assetsData, transactionsData, alertsData] = await Promise.all([
        getCurrentNav(),
        getHoldings(),
        getAssets(),
        getTransactions(),
        getAlerts(userId)
      ]);

      // Set all states at once
      setNav(navData.nav);
      setHoldings(holdingsData);
      setAssets(assetsData);
      setTransactions(transactionsData);
      // Show all alerts in list, but filter out already triggered ones
      const displayAlerts = alertsData.alerts.filter(alert => alert.lastState !== 'triggered');
      setAlerts(displayAlerts);

      // Set all loading states to false
      setNavLoading(false);
      setHoldingsLoading(false);
      setAssetsLoading(false);
      setTransactionsLoading(false);
      setAlertsLoading(false);

      // Setup NAV streaming
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      const eventSource = streamNavUpdates(userId, (data) => {
        setNav(data.nav);
        if (data.prices) {
          setCryptoPrices(data.prices);
        }
        // Process real-time alerts from NAV stream - add to streamAlerts state for notifications
        if (data.type === 'alert') {
          // Show notification for triggered alert
          const message = `Alert triggered: NAV ${data.direction} ${data.thresholdValue.toLocaleString()}`
          
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(message, {
              body: `Your NAV threshold has been crossed`,
              icon: '/favicon.svg'
            })
          }
          
          // Add to streamAlerts state for notifications
          const newStreamAlert: Alert[] = [{
            _id: `stream-${data.timestamp}`,
            userId: data.userId,
            thresholdValue: data.thresholdValue,
            direction: data.direction,
            lastState: data.direction as 'above' | 'below',
            createdAt: data.timestamp,
            updatedAt: data.timestamp,
            __v: 0
          }];
          
          setStreamAlerts(newStreamAlert);
          
          // Remove from streamAlerts after 5 seconds
          setTimeout(() => {
            setStreamAlerts([]);
          }, 5000);
        }
        setNavLoading(false);
      });
      eventSourceRef.current = eventSource;
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      setNavLoading(false);
      setHoldingsLoading(false);
      setAssetsLoading(false);
      setTransactionsLoading(false);
      setAlertsLoading(false);
    }
  };

  const handleBuy = (asset: Asset) => {
    setTradeModal({ asset, type: "BUY" });
  };

  const handleSell = (holding: Holding) => {
    setTradeModal({ asset: holding.assetId, type: "SELL" });
  };

  const handleAlertCreate = async () => {
    if (!user) return;
    try {
      await getAlerts(user._id);
      setAlertsLoading(true);
      const alertsData = await getAlerts(user._id);
      setAlerts(alertsData.alerts);
      setAlertsLoading(false);
    } catch (error) {
      console.error("Failed to refresh alerts:", error);
      setAlertsLoading(false);
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    try {
      await deleteAlert(alertId);
      // Remove alert from local state
      setAlerts(prevAlerts => prevAlerts.filter(alert => alert._id !== alertId));
    } catch (error) {
      console.error("Failed to delete alert:", error);
    }
  };

  const handleTradeConfirm = async (quantity: number) => {
    if (!tradeModal) return;

    try {
      await executeTrade({
        assetId: tradeModal.asset._id,
        quantity,
        type: tradeModal.type,
      });
      
      // Refresh data after trade
      if (user) {
        await fetchDashboardData(user._id);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Trade failed. Please try again.';
      console.log('error.response.data.message', error.response?.data?.message)
      console.error("Trade failed:", error);
      
      // Show error toast
      toast.error(errorMessage);
      
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      // Call the logout API
      await logoutUser();
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      // Always cleanup local data and navigate, even if API call fails
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-blue-800">
              Investors Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">{user.name}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* NAV Card - takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <NavCard nav={nav} loading={navLoading} />
          </div>

          {/* Profile Link Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Account
            </h3>
            <button
              onClick={() => navigate("/profile")}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Update Profile
            </button>
          </div>
        </div>

        {/* Holdings List - Full width */}
        <div className="mt-6">
          <HoldingsList
            holdings={holdings}
            loading={holdingsLoading}
            onSell={handleSell}
            cryptoPrices={cryptoPrices}
          />
        </div>

        {/* Available Assets Section */}
        <div className="mt-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Available Assets
            </h3>

            {assetsLoading ? (
              <div className="text-center py-8 text-gray-400">
                Loading available assets...
              </div>
            ) : assets.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No available assets
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assets.map((asset) => (
                  <AssetCard key={asset._id} asset={asset} onBuy={handleBuy} cryptoPrices={cryptoPrices} />
                ))}
              </div>
            )}
          </div>
        </div>

        {tradeModal && (
          <TradeModal
            asset={tradeModal.asset}
            type={tradeModal.type}
            onClose={() => setTradeModal(null)}
            onConfirm={handleTradeConfirm}
          />
        )}

        {/* Transaction History Section */}
        <div className="mt-6">
          <TransactionsList
            transactions={transactions}
            loading={transactionsLoading}
          />
        </div>

        {/* NAV History Section */}
        <div className="mt-6">
          <NavHistoryChart />
        </div>

        {/* Alerts Section */}
        <div className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <AlertForm onAlertCreated={handleAlertCreate} />
            </div>
            <div>
              <AlertsList
                alerts={alerts}
                loading={alertsLoading}
                onDeleteAlert={handleDeleteAlert}
              />
            </div>
          </div>
        </div>

        {/* Alert Notifications */}
        <AlertNotifications alerts={streamAlerts} />
        
        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </main>
    </div>
  );
};

export default Dashboard;
