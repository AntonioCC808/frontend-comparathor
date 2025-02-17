import Home from '../components/Home';
import Configuration from '../components/Configuration';
import MyProducts from '../components/MyProducts';
import MyComparisons from '../components/MyComparisons';
import AddProduct from '../components/AddProduct';
import AddComparison from '../components/AddComparison';
import Login from '../components/Login';
import SignUp from '../components/SignUp';
import AdminProductTypes from '../components/AdminProductTypes';
import PublicPage from '../components/PublicPage';

const routes = [
  { path: '/', component: PublicPage, protected: false },
  { path: '/home', component: Home, protected: true },
  { path: '/config', component: Configuration, protected: true },
  { path: '/products', component: MyProducts, protected: true },
  { path: '/comparisons', component: MyComparisons, protected: true },
  { path: '/addProduct', component: AddProduct, protected: true },
  { path: '/addComparison', component: AddComparison, protected: true },
  { path: "/login", component: Login, protected: false },
  { path: "/signup", component: SignUp, protected: false },
  { path: "/admin/product-types", component: AdminProductTypes, protected: true, adminOnly: true },
];

export default routes;
