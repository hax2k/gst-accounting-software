import type { ReactNode } from 'react'

import { cn } from '#/lib/utils.ts'

function BrowserChrome({
  title,
  children,
  className,
}: {
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-[var(--radius-hero)] bg-card shadow-(--elevation-2)',
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border/80 bg-muted/40 px-3 py-2">
        <span className="size-2 rounded-full bg-border" />
        <span className="size-2 rounded-full bg-border" />
        <span className="size-2 rounded-full bg-border" />
        <span className="ml-2 truncate text-[0.625rem] text-muted-foreground">
          {title}
        </span>
      </div>
      {children}
    </div>
  )
}

export function InvoicePreview({ className }: { className?: string }) {
  return (
    <BrowserChrome
      className={className}
      title="Celestret.in/app/sales/new"
    >
      <div
        aria-hidden="true"
        className="grid gap-3 bg-background p-4 text-[0.65rem] leading-relaxed text-foreground"
        data-ui="data"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium">Tax Invoice</p>
            <p className="text-muted-foreground">INV-2026-0042 · 01 Aug 2026</p>
          </div>
          <div className="rounded-md bg-money-in/15 px-2 py-1 font-medium text-money-in">
            Intra-state
          </div>
        </div>
        <div className="grid gap-1 rounded-md bg-card p-3 shadow-(--elevation-1)">
          <div className="flex justify-between gap-2 text-muted-foreground">
            <span>Bill to</span>
            <span>Place of supply</span>
          </div>
          <div className="flex justify-between gap-2 font-medium">
            <span>Sharma Traders</span>
            <span>27 — Maharashtra</span>
          </div>
        </div>
        <div className="overflow-hidden rounded-md bg-card shadow-(--elevation-1)">
          <div className="grid grid-cols-[1.4fr_0.5fr_0.6fr_0.7fr] gap-2 border-b border-border bg-muted/50 px-3 py-2 font-medium text-muted-foreground">
            <span>Item</span>
            <span>Qty</span>
            <span>Rate</span>
            <span className="text-right">Amount</span>
          </div>
          {[
            ['Copper Wire 2.5mm', '40', '185.00', '7,400.00'],
            ['MCB 32A', '12', '420.00', '5,040.00'],
            ['PVC Conduit 25mm', '60', '48.00', '2,880.00'],
          ].map(([item, qty, rate, amount]) => (
            <div
              key={item}
              className="grid grid-cols-[1.4fr_0.5fr_0.6fr_0.7fr] gap-2 border-b border-border/70 px-3 py-2 last:border-b-0"
            >
              <span className="truncate">{item}</span>
              <span>{qty}</span>
              <span>{rate}</span>
              <span className="text-right font-medium">{amount}</span>
            </div>
          ))}
        </div>
        <div className="ml-auto grid w-48 gap-1 rounded-md bg-card p-3 shadow-(--elevation-1)">
          <div className="flex justify-between text-muted-foreground">
            <span>Taxable</span>
            <span>15,320.00</span>
          </div>
          <div className="flex justify-between text-gst">
            <span>CGST + SGST</span>
            <span>2,757.60</span>
          </div>
          <div className="flex justify-between border-t border-border pt-1 text-sm font-medium">
            <span>Total</span>
            <span className="text-money-in">18,077.60</span>
          </div>
        </div>
      </div>
    </BrowserChrome>
  )
}

export function ReportsPreview({ className }: { className?: string }) {
  return (
    <BrowserChrome
      className={className}
      title="Celestret.in/app/reports"
    >
      <div
        aria-hidden="true"
        className="grid gap-3 bg-background p-4 text-[0.65rem] text-foreground"
        data-ui="data"
      >
        <p className="text-xs font-medium">GST reports · Jul 2026</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            ['GSTR-1', '₹4.2L', 'text-money-in'],
            ['GSTR-3B', '₹61.8K', 'text-gst'],
            ['2B match', '96%', 'text-banking'],
          ].map(([label, value, tone]) => (
            <div
              key={label}
              className="rounded-md bg-card p-2.5 shadow-(--elevation-1)"
            >
              <p className="text-muted-foreground">{label}</p>
              <p className={cn('mt-1 text-sm font-medium', tone)}>{value}</p>
            </div>
          ))}
        </div>
        <div className="h-16 rounded-md bg-card p-2 shadow-(--elevation-1)">
          <div className="flex h-full items-end gap-1">
            {[40, 65, 48, 80, 55, 72, 90].map((height, index) => (
              <div
                key={index}
                className="flex-1 rounded-sm bg-gst/35"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </BrowserChrome>
  )
}

export function VoucherEntryPreview({ className }: { className?: string }) {
  return (
    <BrowserChrome
      className={className}
      title="Celestret.in/app/sales/new · voucher entry"
    >
      <div
        aria-hidden="true"
        className="grid gap-2 bg-background p-4 text-[0.65rem] text-foreground"
        data-ui="data"
      >
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 rounded-md bg-muted/40 px-2 py-1.5 font-medium text-muted-foreground">
          <span>Account / Item</span>
          <span>Dr</span>
          <span>Cr</span>
          <span>GST</span>
        </div>
        {[
          ['Sundry Debtors · Sharma Traders', '18,077.60', '', ''],
          ['Sales — Electrical', '', '15,320.00', ''],
          ['Output CGST 9%', '', '1,378.80', '9%'],
          ['Output SGST 9%', '', '1,378.80', '9%'],
        ].map(([account, dr, cr, gst]) => (
          <div
            key={account}
            className="grid grid-cols-[1fr_auto_auto_auto] gap-2 border-b border-border/60 px-2 py-1.5 last:border-b-0"
          >
            <span className="truncate">{account}</span>
            <span className="min-w-16 text-right font-medium text-money-in">
              {dr}
            </span>
            <span className="min-w-16 text-right font-medium text-money-out">
              {cr}
            </span>
            <span className="min-w-10 text-right text-gst">{gst}</span>
          </div>
        ))}
        <p className="pt-1 text-muted-foreground">
          Balanced · posted to day book
        </p>
      </div>
    </BrowserChrome>
  )
}
