import MainDashboard from './components/MainDashboard';
import Configuration from './components/Configuration';
import MyProducts from './components/MyProducts';
import MyComparisons from './components/MyComparisons';
import AddProduct from './components/AddProduct';
import AddComparison from './components/AddComparison';

const routes = [
  { path: '/', component: MainDashboard },
  { path: '/config', component: Configuration },
  { path: '/products', component: MyProducts },
  { path: '/comparisons', component: MyComparisons },
  { path: '/addProduct', component: AddProduct },
  { path: '/addComparison', component: AddComparison },
];

export default routes;
