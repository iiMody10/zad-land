import { getAdminOrders } from "../../../../lib/admin-actions";
import OrdersClient from "./OrdersClient";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
    const data = await getAdminOrders(1, 200);

    return <OrdersClient orders={data.orders} />;
}
