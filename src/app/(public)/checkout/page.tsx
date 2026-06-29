import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getCurrentUser } from "@/services/account.service";
import { getDefaultAddressForCheckout } from "@/services/address.service";
import { getCheckoutCart } from "@/services/cart.service";
import { tryApplyCoupon } from "@/services/coupon.service";
import { getAvailablePaymentMethods } from "@/services/payments/registry";
import { getShippingOptions } from "@/services/shipping.service";
import { formatMXN } from "@/utils/format";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Confirma tus datos de entrega y pago.",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const checkoutCart = await getCheckoutCart();

  if (!checkoutCart) {
    redirect("/carrito");
  }

  const shippingOptions = await getShippingOptions(checkoutCart.subtotal);
  const paymentMethods = getAvailablePaymentMethods();
  const appliedCoupon = checkoutCart.couponCode
    ? await tryApplyCoupon(checkoutCart.couponCode, checkoutCart.subtotal)
    : null;

  const [user, defaultAddress] = await Promise.all([
    getCurrentUser(),
    getDefaultAddressForCheckout(),
  ]);
  const defaults = {
    customerName: defaultAddress?.fullName ?? user?.name ?? "",
    customerEmail: user?.email ?? "",
    customerPhone: defaultAddress?.phone ?? "",
    shippingAddress: defaultAddress?.address ?? "",
    postalCode: defaultAddress?.postalCode ?? "",
    city: defaultAddress?.city ?? "",
    state: defaultAddress?.state ?? "",
    addressReference: defaultAddress?.reference ?? "",
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Compra"
        title="Checkout"
        description="Los precios, el envio y el stock se validan en el servidor."
      />

      <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Productos en tu pedido
        </p>
        <ul className="mt-3 grid gap-2 text-sm">
          {checkoutCart.items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-4">
              <span className="text-zinc-700">
                {item.productName}
                <span className="text-zinc-400"> × {item.quantity}</span>
              </span>
              <span className="font-semibold text-zinc-950">
                {formatMXN(item.lineTotal)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <CheckoutForm
          shippingOptions={shippingOptions}
          subtotal={checkoutCart.subtotal}
          paymentMethods={paymentMethods}
          discountAmount={appliedCoupon?.discountAmount ?? 0}
          couponCode={appliedCoupon?.code ?? null}
          freeShipping={appliedCoupon?.freeShipping ?? false}
          defaults={defaults}
        />
      </div>
    </div>
  );
}
