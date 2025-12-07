export const translations = {
    en: {
        // Navigation
        dashboard: "Dashboard",
        labors: "Labors",
        expenses: "Expenses",
        sales: "Sales",
        manufacturing: "Manufacturing",
        logout: "Logout",

        // Dashboard
        total_sales: "Total Sales",
        net_profit: "Net Profit",
        total_expenses: "Total Expenses",
        brick_stock: "Brick Stock",
        labor_financials: "Labor Financials",
        outstanding_advance: "Outstanding Advance",
        total_labor_payments: "Total Labor Payments",
        raw_bricks_produced: "Raw Bricks Produced",
        recent_activity: "Recent Activity",

        // Common Actions
        add_new: "Add New",
        edit: "Edit",
        delete: "Delete",
        view: "View",
        save: "Save",
        cancel: "Cancel",
        search: "Search...",
        download_csv: "Download CSV",
        actions: "Actions",

        // Labors
        labor_list: "Labor List",
        name: "Name",
        address: "Address",
        rate_per_brick: "Rate/Brick",
        total_bricks: "Total Bricks",
        total_paid: "Total Paid",
        current_advance: "Current Advance",
        add_labor: "Add New Labor",
        phone: "Phone",

        // Expenses
        expense_list: "Expense List",
        date: "Date",
        description: "Description",
        category: "Category",
        amount: "Amount",
        add_expense: "Add New Expense",

        // Sales
        sales_list: "Sales List",
        vehicle_no: "Vehicle No",
        brick_type: "Brick Type",
        quantity: "Quantity",
        rate: "Rate",
        total_amount: "Total Amount",
        received_amount: "Received",
        due_amount: "Due",
        status: "Status",
        bill: "Bill",
        add_sale: "Add New Sale",
        paid: "Paid",
        due: "Due",

        // Manufacturing
        manufacturing_list: "Manufacturing List",
        manufacturing_records: "Manufacturing Records",
        production_records: "Production Records",
        labor_name: "Labor Name",
        labor: "Labor",
        add_manufacturing: "Add Manufacturing",
        record_production: "Record Production",
        no_labor_assigned: "No Labor Assigned",

        // Popup
        select_language: "Select Language / भाषा छान्नुहोस्",
        welcome_message: "Welcome to Sanjay Itta Udhyog",
    },
    ne: {
        // Navigation
        dashboard: "ड्यासबोर्ड",
        labors: "मजदुरहरू",
        expenses: "खर्चहरू",
        sales: "बिक्री",
        manufacturing: "उत्पादन",
        logout: "लगआउट",

        // Dashboard
        total_sales: "कुल बिक्री",
        net_profit: "खुद नाफा",
        total_expenses: "कुल खर्च",
        brick_stock: "इट्टा मौज्दात",
        labor_financials: "मजदुर आर्थिक विवरण",
        outstanding_advance: "बाँकी पेश्की",
        total_labor_payments: "कुल मजदुर भुक्तानी",
        raw_bricks_produced: "काँचो इट्टा उत्पादन",
        recent_activity: "हालैका गतिविधिहरू",

        // Common Actions
        add_new: "नयाँ थप्नुहोस्",
        edit: "सम्पादन",
        delete: "हटाउनुहोस्",
        view: "हेर्नुहोस्",
        save: "सेभ गर्नुहोस्",
        cancel: "रद्द गर्नुहोस्",
        search: "खोज्नुहोस्...",
        download_csv: "CSV डाउनलोड",
        actions: "कार्यहरू",

        // Labors
        labor_list: "मजदुर सूची",
        name: "नाम",
        address: "ठेगाना",
        rate_per_brick: "दर/इट्टा",
        total_bricks: "कुल इट्टा",
        total_paid: "कुल भुक्तानी",
        current_advance: "हालको पेश्की",
        add_labor: "नयाँ मजदुर थप्नुहोस्",
        phone: "फोन",

        // Expenses
        expense_list: "खर्च सूची",
        date: "मिति",
        description: "विवरण",
        category: "वर्ग",
        amount: "रकम",
        add_expense: "नयाँ खर्च थप्नुहोस्",

        // Sales
        sales_list: "बिक्री सूची",
        vehicle_no: "गाडी नं",
        brick_type: "इट्टा प्रकार",
        quantity: "परिमाण",
        rate: "दर",
        total_amount: "कुल रकम",
        received_amount: "प्राप्त रकम",
        due_amount: "बाँकी रकम",
        status: "स्थिति",
        bill: "बिल",
        add_sale: "नयाँ बिक्री थप्नुहोस्",
        paid: "भुक्तानी भयो",
        due: "बाँकी",

        // Manufacturing
        manufacturing_list: "उत्पादन सूची",
        manufacturing_records: "उत्पादन रेकर्डहरू",
        production_records: "उत्पादन रेकर्डहरू",
        labor_name: "मजदुरको नाम",
        labor: "मजदुर",
        add_manufacturing: "उत्पादन थप्नुहोस्",
        record_production: "उत्पादन रेकर्ड गर्नुहोस्",
        no_labor_assigned: "मजदुर तोकिएको छैन",

        // Popup
        select_language: "भाषा छान्नुहोस्",
        welcome_message: "सञ्जय इट्टा उद्योगमा स्वागत छ",
    }
};

export type Language = 'en' | 'ne';
export type TranslationKey = keyof typeof translations.en;
