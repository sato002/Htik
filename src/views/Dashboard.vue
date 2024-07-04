<script setup lang="ts">
import { ref, onBeforeMount, reactive } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { CustomerService } from '@/service/CustomerService';
import { ProductService } from '@/service/ProductService';
import { AccountService } from '@/service/AccountService';

const customer1 = ref(null);
const customer2 = ref(null);
const customer3 = ref(null);
const account = ref(null);
const filters1 = ref(null);
const loading1 = ref(null);
const loading2 = ref(null);
const idFrozen = ref(false);
const products = ref(null);
const expandedRows = ref([]);
const statuses = reactive(['unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal']);
const representatives = reactive([
    { name: 'Amy Elsner', image: 'amyelsner.png' },
    { name: 'Anna Fali', image: 'annafali.png' },
    { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
    { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
    { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
    { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
    { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
    { name: 'Onyama Limba', image: 'onyamalimba.png' },
    { name: 'Stephen Shaw', image: 'stephenshaw.png' },
    { name: 'XuXue Feng', image: 'xuxuefeng.png' }
]);

const customerService = new CustomerService();
const productService = new ProductService();
const accountService = new AccountService();

const getBadgeSeverity = (inventoryStatus) => {
    switch (inventoryStatus.toLowerCase()) {
        case 'instock':
            return 'success';
        case 'lowstock':
            return 'warning';
        case 'outofstock':
            return 'danger';
        default:
            return 'info';
    }
};
const getSeverity = (status) => {
    switch (status) {
        case 'unqualified':
            return 'danger';

        case 'qualified':
            return 'success';

        case 'new':
            return 'info';

        case 'negotiation':
            return 'warning';

        case 'renewal':
            return null;
    }
};

onBeforeMount(() => {
    productService.getProductsWithOrdersSmall().then((data) => (products.value = data));
    customerService.getCustomersLarge().then((data) => {
        customer1.value = data;
        loading1.value = false;
        customer1.value.forEach((customer) => (customer.date = new Date(customer.date)));
    });
    customerService.getCustomersLarge().then((data) => (customer2.value = data));
    customerService.getCustomersMedium().then((data) => (customer3.value = data));
    
    accountService.getAccounts().then((data) => {
        debugger
        account.value = data;
    });

    loading2.value = false;

    initFilters1();
});

const initFilters1 = () => {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        representative: { value: null, matchMode: FilterMatchMode.IN },
        date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        activity: { value: [0, 100], matchMode: FilterMatchMode.BETWEEN },
        verified: { value: null, matchMode: FilterMatchMode.EQUALS }
    };
};

const clearFilter1 = () => {
    initFilters1();
};
const expandAll = () => {
    expandedRows.value = products.value.reduce((acc, p) => (acc[p.id] = true) && acc, {});
};
const collapseAll = () => {
    expandedRows.value = null;
};
const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const formatDate = (value) => {
    return value.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};
const calculateCustomerTotal = (name) => {
    let total = 0;
    if (customer3.value) {
        for (let customer of customer3.value) {
            if (customer.representative.name === name) {
                total++;
            }
        }
    }

    return total;
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <DataTable
                    :value="account"
                    :rowHover="true"
                    :scrollable="true" 
                    scrollHeight="400px"
                    scrollDirection="both"
                    filterDisplay="menu"
                    :loading="loading1"
                    
                    showGridlines
                >
                    <template #header>
                        <div class="flex justify-content-between flex-column sm:flex-row">
                            <ButtonGroup>
                                <Button label="Start" icon="pi pi-play" outlined/>
                                <Button label="Add" icon="pi pi-plus" outlined/>
                                <Button label="Delete" icon="pi pi-trash" outlined/>
                                <Button label="Clear" icon="pi pi-filter-slash" outlined @click="clearFilter1()" />
                            </ButtonGroup>
                            <IconField iconPosition="left">
                                <InputIcon class="pi pi-search" />
                                <InputText v-model="filters1['global'].value" placeholder="Keyword Search" style="width: 100%" />
                            </IconField>
                        </div>
                    </template>
                    <template #empty> No customers found. </template>
                    <template #loading> Loading customers data. Please wait. </template>
                    <Column field="TDSUserName" header="TDS.UserName" frozen style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.TDS.Username }}
                        </template>
                    </Column>
                    <Column field="TDSPassword" header="TDS.Password">
                        <template #body="{ data }">
                            {{ data.TDS.Password }}
                        </template>
                    </Column>
                    <Column field="TDSToken" header="TDS.Token">
                        <template #body="{ data }">
                            {{ data.TDS.Token }}
                        </template>
                    </Column>
                    <Column field="TiktokUsername" header="Tiktok.Username">
                        <template #body="{ data }">
                            {{ data.Tiktok.Username }}
                        </template>
                    </Column>
                    <Column field="TiktokPassword" header="Tiktok.Password">
                        <template #body="{ data }">
                            {{ data.Tiktok.Password }}
                        </template>
                    </Column>
                    <Column field="TDSXu" header="Xu">
                        <template #body="{ data }">
                            {{ data.TDS.Xu }}
                        </template>
                    </Column>
                    <Column field="TDSXuThem" header="XuThem">
                        <template #body="{ data }">
                            {{ data.TDS.XuThem }}
                        </template>
                    </Column>
                    <Column field="Message" header="Thông báo">
                        <template #body="{ data }">
                            {{ data.Message }}
                        </template>
                    </Column>
                    <Column frozen alignFrozen="right" style="width: 15%">
                        <template #header> Action </template>
                        <template #body>
                            <Button icon="pi pi-play" type="button" class="p-button-text" @click="clearFilter1()"></Button>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
:deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

:deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}
</style>
