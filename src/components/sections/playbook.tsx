export const PlaybookA = {
    commit1: {
        commit_hash: "c1_hash_burger_99",
        parent_hash: null,
        merge_parent_hashes: null,
        branch: "main",
        timestamp: "2026-06-11T16:15:00Z",
        author_id: "terminal-01",
        deltas: [
            {
                action: "declare_allocation",
                allocation: {
                    allocation_id: "alloc-001-assign-bob",
                    type: "assignment",
                    entity: "Bob",
                },
            },
            {
                action: "declare_allocation",
                allocation: {
                    allocation_id: "alloc-002-pay-bob",
                    type: "payment",
                    payer: "Bob",
                    method: "cash",
                    payment_strategy: { strategy_type: "percentage", value: 1.0 },
                    time_of_payment: { type: "immediate", calculated_at: "2026-06-11T16:15:00Z" },
                },
            },
            {
                action: "add_item",
                line_id: "line-001-burger",
                parent_line_id: null,
                sku: "SKU-BURGER-REGULAR",
                qty: 1,
                allocations: ["alloc-001-assign-bob", "alloc-002-pay-bob"],
            },
        ],
    },
    commit2: {
        commit_hash: "c2_hash_split_02",
        parent_hash: "c1_hash_burger_99",
        merge_parent_hashes: null,
        branch: "what-if-split",
        timestamp: "2026-06-11T16:17:00Z",
        author_id: "terminal-01",
        deltas: [
            {
                action: "declare_allocation",
                allocation: {
                    allocation_id: "alloc-002-pay-bob",
                    type: "payment",
                    payer: "Alice",
                    method: "visa",
                    payment_strategy: { strategy_type: "percentage", value: 1.0 },
                    time_of_payment: { type: "immediate", calculated_at: "2026-06-11T16:17:00Z" },
                },
            },
        ],
    },
    commit3: {
        commit_hash: "c3_hash_upgrade_03",
        parent_hash: "c2_hash_split_02",
        merge_parent_hashes: null,
        branch: "what-if-split",
        timestamp: "2026-06-11T16:18:30Z",
        author_id: "terminal-01",
        deltas: [
            {
                action: "declare_allocation",
                allocation: {
                    allocation_id: "alloc-003-fulfillment-alice",
                    type: "fulfillment",
                    method: "delivery",
                    time: { type: "immediate", calculated_at: "2026-06-11T16:18:30Z" },
                    fulfillment_metadata: {
                        destination_label: "Business Main office",
                        destination_id: "addr-9988-corp",
                    },
                },
            },
            {
                action: "modify_item_allocations",
                line_id: "line-001-burger",
                before_allocations: ["alloc-001-assign-bob", "alloc-002-pay-bob"],
                after_allocations: ["alloc-001-assign-bob", "alloc-002-pay-bob", "alloc-003-fulfillment-alice"],
            },
        ],
    },
};

export const PlaybookB = {
    checkingActiveTotals: {
        target_context: {
            context_type: "cart",
            context_id: "cart-table-12",
            revision_id: "c3_hash_upgrade_03",
        },
        filter_delta: { add_filters: [], remove_filters: [] },
        view_mode: "item_level",
        order_constraints: {},
        commit: true,
    },
    timeTraveling: {
        target_context: {
            context_type: "cart",
            context_id: "cart-table-12",
            revision_id: "c1_hash_burger_99",
        },
        filter_delta: { add_filters: [], remove_filters: [] },
        view_mode: "item_level",
        order_constraints: {},
        commit: true,
    },
};

export const PlaybookC = {
    safeCatalogFiltering: {
        target_context: {
            context_type: "catalog",
            context_id: "menu-summer-v2",
            revision_id: "rev_menu_44312",
        },
        filter_delta: {
            add_filters: [
                { property: "sku_category", operator: "equals", value: "dessert" },
                { property: "dietary_flags", operator: "equals", value: "gluten_free" },
                { property: "allergens", operator: "not_in_set", value: ["peanuts", "tree_nuts"] },
                { property: "brand", operator: "equals", value: "GourmetCo" },
            ],
            remove_filters: [],
        },
        view_mode: "catalog_listing_view",
        order_constraints: { allow_backorder: true },
        commit: true,
    },
    textSearchMatch: {
        target_context: {
            context_type: "catalog",
            context_id: "menu-summer-v2",
            revision_id: "rev_menu_44312",
        },
        filter_delta: {
            add_filters: [{ property: "name", operator: "like", value: "burger" }],
            remove_filters: [],
        },
        view_mode: "catalog_listing_view",
        order_constraints: {},
        commit: true,
    },
};

export const PlaybookD = {
    cleanThreeWayMergeCommit: {
        commit_hash: "c4_merge_hash_final",
        parent_hash: "c1_hash_burger_99",
        merge_parent_hashes: ["c3_hash_upgrade_03"],
        branch: "main",
        timestamp: "2026-06-11T16:25:00Z",
        author_id: "terminal-01",
        deltas: [],
    },
};

export const PlaybookE = {
    declarativeBatchMutation: {
        commit_hash: "c5_batch_realloc_01",
        parent_hash: "c4_merge_hash_final",
        merge_parent_hashes: null,
        branch: "main",
        timestamp: "2026-06-11T16:30:00Z",
        author_id: "ai-assistant-01",
        deltas: [
            {
                action: "declare_allocation",
                allocation: {
                    allocation_id: "alloc-batch-dessert-alice",
                    correlation_id: "corr-alice-desserts",
                    type: "payment",
                    payer: "Alice",
                    method: "mastercard",
                    payment_strategy: { strategy_type: "percentage", value: 1.0 },
                    time_of_payment: { type: "immediate", calculated_at: "2026-06-11T16:30:00Z" },
                },
            },
            {
                action: "batch_by_filter",
                base_revision_id: "c4_merge_hash_final",
                filters: [
                    { property: "sku_category", operator: "equals", value: "dessert" },
                    { property: "payer", operator: "equals", value: "Bob" },
                ],
                template_mutation: {
                    mutation_type: "batch_modify_allocations",
                    target_allocation_type: "payment",
                    patch_allocation: {
                        allocation_id: "alloc-batch-dessert-alice",
                        type: "payment",
                    },
                },
            },
        ],
    },
};

export const PlaybookF = {
    mimicOrderScenario: {
        commit_hash: "c6_mimic_bob_99",
        parent_hash: "c5_batch_realloc_01",
        merge_parent_hashes: null,
        branch: "main",
        timestamp: "2026-06-11T16:35:00Z",
        author_id: "ai-assistant-01",
        deltas: [
            {
                action: "declare_allocation",
                allocation: {
                    allocation_id: "alloc-george-assigned",
                    type: "assignment",
                    entity: "George",
                },
            },
            {
                action: "declare_allocation",
                allocation: {
                    allocation_id: "alloc-george-payment",
                    type: "payment",
                    payer: "George",
                    method: "visa",
                    payment_strategy: { strategy_type: "percentage", value: 1.0 },
                    time_of_payment: { type: "immediate", calculated_at: "2026-06-11T16:35:00Z" },
                },
            },
            {
                action: "batch_by_filter",
                base_revision_id: "c5_batch_realloc_01",
                filters: [{ property: "assignee", operator: "equals", value: "Bob" }],
                template_mutation: {
                    mutation_type: "batch_duplicate_and_reallocate",
                    patch_allocations: [
                        { allocation_id: "alloc-george-assigned", type: "assignment" },
                        { allocation_id: "alloc-george-payment", type: "payment" },
                    ],
                },
            },
        ],
    },
};

export const PlaybookG = {
    addingScopedUnconditionalDiscount: {
        commit_hash: "c7_flat_discount_01",
        parent_hash: "c6_mimic_bob_99",
        merge_parent_hashes: null,
        branch: "main",
        timestamp: "2026-06-11T16:40:00Z",
        author_id: "terminal-01",
        deltas: [
            {
                action: "add_item",
                line_id: "line-discount-01",
                parent_line_id: "line-001-burger",
                sku: "CREDIT-MANUAL-FIVE",
                qty: 1,
                allocations: ["alloc-discount-bob-pay"],
            },
        ],
    },
    addingGlobalConditionalOffer: {
        commit_hash: "c8_conditional_promo_01",
        parent_hash: "c7_flat_discount_01",
        merge_parent_hashes: null,
        branch: "main",
        timestamp: "2026-06-11T16:42:00Z",
        author_id: "agent-promotions-01",
        deltas: [
            {
                action: "add_item",
                line_id: "line-promo-global-10pct",
                parent_line_id: null,
                sku: "10PCT-OFF-GLOBAL",
                qty: 1,
                allocations: [],
            },
        ],
    },
};

export const PlaybookH = {
    hierarchicalComboCustomizations: {
        commit_hash: "c9_custom_combo_101",
        parent_hash: "c8_conditional_promo_01",
        merge_parent_hashes: null,
        branch: "main",
        timestamp: "2026-06-11T16:50:00Z",
        author_id: "terminal-01",
        deltas: [
            {
                action: "declare_allocation",
                allocation: {
                    allocation_id: "alloc-combo-bob-assign",
                    type: "assignment",
                    entity: "Bob",
                },
            },
            {
                action: "declare_allocation",
                allocation: {
                    allocation_id: "alloc-combo-bob-pay",
                    type: "payment",
                    payer: "Bob",
                    method: "visa",
                    payment_strategy: { strategy_type: "percentage", value: 1.0 },
                    time_of_payment: { type: "immediate", calculated_at: "2026-06-11T16:50:00Z" },
                },
            },
            {
                action: "add_item",
                line_id: "line-triple-combo-001",
                parent_line_id: null,
                sku: "SKU-COMBO-TRIPLE",
                qty: 1,
                allocations: ["alloc-combo-bob-assign", "alloc-combo-bob-pay"],
            },
            {
                action: "add_item",
                line_id: "line-combo-pizza",
                parent_line_id: "line-triple-combo-001",
                sku: "SKU-PIZZA-BASE",
                qty: 1,
                allocations: [],
            },
            {
                action: "add_item",
                line_id: "mod-pizza-pep",
                parent_line_id: "line-combo-pizza",
                sku: "MOD-TOPPING-PEPPERONI",
                qty: 1,
                allocations: [],
            },
            {
                action: "add_item",
                line_id: "mod-pizza-mush",
                parent_line_id: "line-combo-pizza",
                sku: "MOD-TOPPING-MUSHROOM",
                qty: 1,
                allocations: [],
            },
            {
                action: "add_item",
                line_id: "line-combo-fries",
                parent_line_id: "line-triple-combo-001",
                sku: "SKU-FRIES-BASE",
                qty: 1,
                allocations: [],
            },
            {
                action: "add_item",
                line_id: "mod-fries-size-lg",
                parent_line_id: "line-combo-fries",
                sku: "MOD-SIZE-LARGE",
                qty: 1,
                allocations: [],
            },
            {
                action: "add_item",
                line_id: "line-combo-soda",
                parent_line_id: "line-triple-combo-001",
                sku: "SKU-DRINK-SODA",
                qty: 1,
                allocations: [],
            },
            {
                action: "add_item",
                line_id: "mod-soda-bottle-2l",
                parent_line_id: "line-combo-soda",
                sku: "MOD-PKG-2L",
                qty: 1,
                allocations: [],
            },
        ],
    },
};

export const PlaybookI = {
    alaCarteCustomizations: {
        commit_hash: "c10_alacarte_kungpao_202",
        parent_hash: "c9_custom_combo_101",
        merge_parent_hashes: null,
        branch: "main",
        timestamp: "2026-06-11T17:05:00Z",
        author_id: "terminal-02",
        deltas: [
            {
                action: "add_item",
                line_id: "line-kpc-large-101",
                parent_line_id: null,
                sku: "SKU-KUNGPAO-LARGE",
                qty: 1,
                allocations: ["alloc-combo-bob-assign", "alloc-combo-bob-pay"],
            },
            {
                action: "add_item",
                line_id: "line-side-rice-101",
                parent_line_id: "line-kpc-large-101",
                sku: "SKU-FRIEDRICE-SIDE",
                qty: 1,
                allocations: [],
            },
            {
                action: "add_item",
                line_id: "mod-rice-no-onions",
                parent_line_id: "line-side-rice-101",
                sku: "MOD-EXCLUDE-ONION",
                qty: 1,
                allocations: [],
            },
        ],
    },
};

export const PlaybookJ = {
    complexHardwareConfigurations: {
        commit_hash: "c11_hardware_notebook_303",
        parent_hash: "c10_alacarte_kungpao_202",
        merge_parent_hashes: null,
        branch: "main",
        timestamp: "2026-06-11T19:15:00Z",
        author_id: "terminal-pos-03",
        deltas: [
            {
                action: "declare_allocation",
                allocation: {
                    allocation_id: "alloc-laptop-owner",
                    type: "assignment",
                    entity: "Alice",
                },
            },
            {
                action: "declare_allocation",
                allocation: {
                    allocation_id: "alloc-laptop-payment",
                    type: "payment",
                    payer: "Alice",
                    method: "mastercard",
                    payment_strategy: { strategy_type: "percentage", value: 1.0 },
                    time_of_payment: { type: "immediate", calculated_at: "2026-06-11T19:15:00Z" },
                },
            },
            {
                action: "add_item",
                line_id: "line-laptop-base-101",
                parent_line_id: null,
                sku: "SKU-PC-LAPTOP-BASE",
                qty: 1,
                allocations: ["alloc-laptop-owner", "alloc-laptop-payment"],
            },
            {
                action: "add_item",
                line_id: "line-laptop-cpu",
                parent_line_id: "line-laptop-base-101",
                sku: "SKU-CPU-RYZEN9",
                qty: 1,
                allocations: [],
            },
            {
                action: "add_item",
                line_id: "line-laptop-gpu",
                parent_line_id: "line-laptop-base-101",
                sku: "SKU-GPU-RTX5090",
                qty: 1,
                allocations: [],
            },
            {
                action: "add_item",
                line_id: "line-gpu-warranty",
                parent_line_id: "line-laptop-gpu",
                sku: "SKU-WRNTY-GPU-3YR",
                qty: 1,
                allocations: [],
            },
            {
                action: "add_item",
                line_id: "line-laptop-ram",
                parent_line_id: "line-laptop-base-101",
                sku: "SKU-RAM-64GB",
                qty: 1,
                allocations: [],
            },
            {
                action: "add_item",
                line_id: "line-laptop-ssd",
                parent_line_id: "line-laptop-base-101",
                sku: "SKU-SSD-2TB",
                qty: 1,
                allocations: [],
            },
            {
                action: "add_item",
                line_id: "line-laptop-display",
                parent_line_id: "line-laptop-base-101",
                sku: "SKU-DSP-16IPS",
                qty: 1,
                allocations: [],
            },
            {
                action: "add_item",
                line_id: "line-global-warranty",
                parent_line_id: "line-laptop-base-101",
                sku: "SKU-WRNTY-GLOBAL-1YR",
                qty: 1,
                allocations: [],
            },
        ],
    },
};

export const PlaybookK = {
    menuDiscoveryQuery: {
        name: "view_menu",
        arguments: {
            category: "burger",
            sort_by: "price",
            order: "asc",
            filter_rules_override: [
                {
                    property: "price",
                    operator: "less_than",
                    value: 15.00,
                },
            ],
        },
    },
    vcsEngineReturnPayload: [
        {
            sku: "SKU-BURGER-REGULAR",
            name: "Regular Cheeseburger",
            base_price: 12.99,
            sku_category: "burger",
            allergens: ["dairy", "wheat"],
            dietary_flags: ["gluten_containing"],
            brand: "GourmetCo",
        },
    ],
    decoupledOrderAdditionCommits: {
        name: "commit_transaction_deltas",
        arguments: {
            branch: "main",
            author_id: "ai-agent-01",
            deltas: [
                {
                    action: "declare_allocation",
                    allocation: {
                        allocation_id: "alloc-001-assign-bob",
                        type: "assignment",
                        entity: "Bob",
                    },
                },
                {
                    action: "declare_allocation",
                    allocation: {
                        allocation_id: "alloc-002-pay-bob",
                        type: "payment",
                        payer: "Bob",
                        method: "cash",
                        payment_strategy: { strategy_type: "percentage", value: 1.0 },
                    },
                },
                {
                    action: "add_item",
                    line_id: "line-001-burger",
                    parent_line_id: null,
                    sku: "SKU-BURGER-REGULAR",
                    qty: 1,
                    allocations: ["alloc-001-assign-bob", "alloc-002-pay-bob"],
                },
                {
                    action: "add_item",
                    line_id: "line-001-mod-no-onion",
                    parent_line_id: "line-001-burger",
                    sku: "MOD-EXCLUDE-ONION",
                    qty: 1,
                    allocations: [],
                },
            ],
        },
    },
    vcsClientLocalRendering: {
        active_revision: "c1_hash_burger_add",
        line_items: {
            "line-001-burger": {
                line_id: "line-001-burger",
                sku: "SKU-BURGER-REGULAR",
                name: "Regular Cheeseburger",
                qty: 1,
                base_price: 12.99,
                allocations: [
                    { allocation_id: "alloc-001-assign-bob", type: "assignment", entity: "Bob" },
                    { allocation_id: "alloc-002-pay-bob", type: "payment", payer: "Bob", method: "cash" },
                ],
                modifiers: [
                    {
                        line_id: "line-001-mod-no-onion",
                        sku: "MOD-EXCLUDE-ONION",
                        name: "No Onions Modifier",
                        base_price: 0.00,
                    },
                ],
            },
        },
        financials: {
            subtotal: 12.99,
            tax: 1.04,
            total: 14.03,
        },
    },
};

export const PlaybookL = {
    requestDeletion: {
        name: "commit_transaction_deltas",
        arguments: {
            branch: "main",
            author_id: "ai-agent-01",
            deltas: [
                {
                    action: "remove_item",
                    line_id: "line-001-burger",
                    qty: 1,
                },
            ],
        },
    },
    vcsClientLocalRendering: {
        active_revision: "c2_hash_burger_remove",
        line_items: {},
        financials: {
            subtotal: 0.00,
            tax: 0.00,
            total: 0.00,
        },
    },
};