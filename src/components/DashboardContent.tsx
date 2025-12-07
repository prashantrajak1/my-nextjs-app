'use client';

import Navbar from '@/components/Navbar';
import {
    Users,
    IndianRupee,
    ShoppingCart,
    TrendingUp,
    Package2,
    Factory,
    TrendingDown,
} from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';

interface DashboardContentProps {
    laborCount: number;
    totalExpenses: number;
    totalSales: number;
    totalReceived: number;
    totalAdvance: number;
    totalLaborPaid: number;
    totalRawBricks: number;
    totalManufactured: number;
    totalBricksSold: number;
    manufacturedByType: Record<string, number>;
    soldByType: Record<string, number>;
    remainingByType: Record<string, number>;
    avgBricksPerSale: number;
    currentYear: number;
}

function formatCurrency(value: number | null | undefined) {
    if (value == null) return '₹0';
    return `₹${value.toLocaleString('en-IN')}`;
}

const BRICK_TYPES = ['No.1', 'No.2', 'No.3'] as const;

export default function DashboardContent({
    laborCount,
    totalExpenses,
    totalSales,
    totalReceived,
    totalAdvance,
    totalLaborPaid,
    totalRawBricks,
    totalManufactured,
    totalBricksSold,
    manufacturedByType,
    soldByType,
    remainingByType,
    avgBricksPerSale,
    currentYear,
}: DashboardContentProps) {
    const { t } = useTranslation();

    return (
        <div className="dashboard">
            <Navbar />

            <main className="dashboard-inner">
                {/* HEADER SECTION */}
                <section className="dashboard-header-card">
                    <div className="dashboard-header-left">
                        <div className="dashboard-logo">S</div>
                        <div className="dashboard-title-block">
                            <h1>SANJAY ITTA UDHYOG</h1>
                            <p>Premium Brick Manufacturing &amp; Management System</p>
                        </div>
                    </div>

                    <div className="dashboard-header-right">
                        <div className="dashboard-mini-card">
                            <div className="dashboard-mini-card-label">Active Labors</div>
                            <div className="dashboard-mini-card-value">
                                {laborCount}
                            </div>
                        </div>
                        <div className="dashboard-mini-card">
                            <div className="dashboard-mini-card-label">Total Revenue</div>
                            <div className="dashboard-mini-card-value">
                                {formatCurrency(totalReceived)}
                            </div>
                        </div>
                    </div>
                </section>

                {/* GRID OF MAIN CARDS */}
                <section className="dashboard-grid">
                    {/* Total Labors */}
                    <div className="dashboard-card dashboard-card--labors">
                        <div className="dashboard-card-header">
                            <div className="dashboard-card-icon">
                                <Users size={22} />
                            </div>
                            <div className="dashboard-card-label">WORKFORCE</div>
                        </div>
                        <div>
                            <div className="dashboard-card-title">{t('labor_list')}</div>
                            <div className="dashboard-card-value">{laborCount}</div>
                        </div>
                    </div>

                    {/* Total Expenses */}
                    <div className="dashboard-card dashboard-card--expenses">
                        <div className="dashboard-card-header">
                            <div className="dashboard-card-icon">
                                <IndianRupee size={22} />
                            </div>
                            <div className="dashboard-card-label">OUTFLOW</div>
                        </div>
                        <div>
                            <div className="dashboard-card-title">{t('total_expenses')}</div>
                            <div className="dashboard-card-value">
                                {formatCurrency(totalExpenses)}
                            </div>
                        </div>
                    </div>

                    {/* Total Sales */}
                    <div className="dashboard-card dashboard-card--sales">
                        <div className="dashboard-card-header">
                            <div className="dashboard-card-icon">
                                <ShoppingCart size={22} />
                            </div>
                            <div className="dashboard-card-label">GROSS SALES</div>
                        </div>
                        <div>
                            <div className="dashboard-card-title">{t('total_sales')}</div>
                            <div className="dashboard-card-value">
                                {formatCurrency(totalSales)}
                            </div>
                        </div>
                    </div>

                    {/* Total Received */}
                    <div className="dashboard-card dashboard-card--received">
                        <div className="dashboard-card-header">
                            <div className="dashboard-card-icon">
                                <TrendingUp size={22} />
                            </div>
                            <div className="dashboard-card-label">CASH IN</div>
                        </div>
                        <div>
                            <div className="dashboard-card-title">{t('received_amount')}</div>
                            <div className="dashboard-card-value">
                                {formatCurrency(totalReceived)}
                            </div>
                        </div>
                    </div>
                </section>

                {/* LABOR FINANCIALS SECTION */}
                <section className="dashboard-grid mt-6 mb-6">
                    {/* Outstanding Advance */}
                    <div className="dashboard-card" style={{ borderColor: 'rgba(239, 68, 68, 0.5)' }}>
                        <div className="dashboard-card-header">
                            <div className="dashboard-card-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
                                <IndianRupee size={22} />
                            </div>
                            <div className="dashboard-card-label" style={{ color: '#fca5a5' }}>OUTSTANDING ADVANCE</div>
                        </div>
                        <div>
                            <div className="dashboard-card-title">{t('outstanding_advance')}</div>
                            <div className="dashboard-card-value" style={{ color: '#ef4444' }}>
                                {formatCurrency(totalAdvance)}
                            </div>
                        </div>
                    </div>

                    {/* Total Labor Payments */}
                    <div className="dashboard-card" style={{ borderColor: 'rgba(59, 130, 246, 0.5)' }}>
                        <div className="dashboard-card-header">
                            <div className="dashboard-card-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
                                <Users size={22} />
                            </div>
                            <div className="dashboard-card-label" style={{ color: '#93c5fd' }}>LABOR PAYMENTS</div>
                        </div>
                        <div>
                            <div className="dashboard-card-title">{t('total_labor_payments')}</div>
                            <div className="dashboard-card-value" style={{ color: '#3b82f6' }}>
                                {formatCurrency(totalLaborPaid)}
                            </div>
                        </div>
                    </div>
                </section>

                {/* BRICKS SUMMARY SECTION */}
                <section className="dashboard-bricks-card">
                    <div className="dashboard-bricks-header">
                        <div className="dashboard-bricks-title-block">
                            <h2>Bricks Summary</h2>
                            <p>
                                Manufacturing, sales, and inventory overview for {currentYear}.
                            </p>
                        </div>
                        <div className="dashboard-bricks-badge">
                            <Package2
                                size={14}
                                style={{ marginRight: 6, verticalAlign: 'text-bottom' }}
                            />
                            BRICKS SUMMARY
                        </div>
                    </div>

                    {/* Raw Bricks Produced Section */}
                    <div className="dashboard-bricks-section">
                        <div className="dashboard-bricks-section-header">
                            <Package2 size={20} />
                            <h3>{t('raw_bricks_produced')}</h3>
                        </div>
                        <div className="dashboard-bricks-main-stat">
                            <div className="dashboard-bricks-stat-value-large">
                                {totalRawBricks.toLocaleString('en-IN')}
                            </div>
                            <div className="dashboard-bricks-stat-note">
                                Total raw bricks made by labors
                            </div>
                        </div>
                    </div>

                    {/* Total Manufactured Section */}
                    <div className="dashboard-bricks-section">
                        <div className="dashboard-bricks-section-header">
                            <Factory size={20} />
                            <h3>Total Bricks Manufactured ({currentYear})</h3>
                        </div>
                        <div className="dashboard-bricks-main-stat">
                            <div className="dashboard-bricks-stat-value-large">
                                {totalManufactured.toLocaleString('en-IN')}
                            </div>
                            <div className="dashboard-bricks-stat-note">
                                Total bricks produced in current year
                            </div>
                        </div>

                        {/* Breakdown by type */}
                        <div className="dashboard-bricks-breakdown">
                            {BRICK_TYPES.map((type) => (
                                <div key={type} className="dashboard-bricks-breakdown-item">
                                    <div className="dashboard-bricks-breakdown-label">
                                        Type {type}
                                    </div>
                                    <div className="dashboard-bricks-breakdown-value">
                                        {(manufacturedByType[type] ?? 0).toLocaleString('en-IN')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total Sold Section */}
                    <div className="dashboard-bricks-section">
                        <div className="dashboard-bricks-section-header">
                            <TrendingDown size={20} />
                            <h3>Total Bricks Sold</h3>
                        </div>
                        <div className="dashboard-bricks-main-stat">
                            <div className="dashboard-bricks-stat-value-large">
                                {totalBricksSold.toLocaleString('en-IN')}
                            </div>
                            <div className="dashboard-bricks-stat-note">
                                Total bricks sold across all sales
                            </div>
                        </div>

                        {/* Breakdown by type */}
                        <div className="dashboard-bricks-breakdown">
                            {BRICK_TYPES.map((type) => (
                                <div key={type} className="dashboard-bricks-breakdown-item">
                                    <div className="dashboard-bricks-breakdown-label">
                                        Type {type}
                                    </div>
                                    <div className="dashboard-bricks-breakdown-value">
                                        {(soldByType[type] ?? 0).toLocaleString('en-IN')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Remaining Inventory Section */}
                    <div className="dashboard-bricks-section">
                        <div className="dashboard-bricks-section-header">
                            <Package2 size={20} />
                            <h3>{t('brick_stock')}</h3>
                        </div>
                        <div className="dashboard-bricks-main-stat">
                            <div className="dashboard-bricks-stat-value-large">
                                {(totalManufactured - totalBricksSold).toLocaleString('en-IN')}
                            </div>
                            <div className="dashboard-bricks-stat-note">
                                Bricks available in stock
                            </div>
                        </div>

                        {/* Breakdown by type */}
                        <div className="dashboard-bricks-breakdown">
                            {BRICK_TYPES.map((type) => (
                                <div key={type} className="dashboard-bricks-breakdown-item">
                                    <div className="dashboard-bricks-breakdown-label">
                                        Type {type}
                                    </div>
                                    <div className="dashboard-bricks-breakdown-value">
                                        {(remainingByType[type] ?? 0).toLocaleString('en-IN')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Additional Stats */}
                    <div className="dashboard-bricks-stats">
                        <div className="dashboard-bricks-stat">
                            <div className="dashboard-bricks-stat-label">
                                AVG BRICKS PER SALE
                            </div>
                            <div className="dashboard-bricks-stat-value">
                                {avgBricksPerSale.toLocaleString('en-IN')}
                            </div>
                            <div className="dashboard-bricks-stat-note">
                                Average quantity per sale record
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
