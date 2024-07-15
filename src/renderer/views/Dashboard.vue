<script setup lang="ts">
import { ref, onBeforeMount, reactive } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { AccountService } from '@/service/AccountService';
import { ExtraColumn } from '@/model/ExtraColumn';

const extraColumns = ref<ExtraColumn[]>([
    new ExtraColumn('TDSPassword','TDS.Mật khẩu'),
    new ExtraColumn('TDSToken', 'TDS.Token'),
    new ExtraColumn('TiktokPassword', 'Tik.Mật khẩu')
]);
const selectedExtraColumns = ref<ExtraColumn[]>([]);

const accounts = ref(null);
const loadingAccount = ref(true);
const selectedAccounts = ref();

const accountService = new AccountService();

onBeforeMount(() => {
    accountService.getAccounts().then((data) => {
        loadingAccount.value = false;
        accounts.value = data;
    });
});

const onToggleExtraColumns = (val) => {
    selectedExtraColumns.value = extraColumns.value.filter(col => val.includes(col));
};

const isShowColumn = (columnName) => {
    var exists = selectedExtraColumns.value.filter(col => col.field == columnName).length > 0;
    return exists;
};

const execute = () => {
    window.electronAPI.Execute();
};

</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <DataTable
                    scrollDirection="both"
                    filterDisplay="menu"
                    size="small"
                    showGridlines
                    removableSort 
                    selectionMode="multiple"
                    :rowHover="true"
                    :scrollable="true" 
                    :loading="loadingAccount"
                    resizableColumns 
                    columnResizeMode="expand"

                    :value="accounts"
                    v-model:selection="selectedAccounts"
                >
                    <template #header>
                        <div class="flex justify-content-between flex-column sm:flex-row">
                            <ButtonGroup>
                                <Button label="Bắt dầu" icon="pi pi-play" outlined @click="execute()"/>
                                <Button label="Kết thúc" icon="pi pi-stop" outlined/>
                                <Button label="Tạo Profile" icon="pi pi-plus" outlined/>
                                <Button label="Xóa Profile" icon="pi pi-trash" outlined/>
                            </ButtonGroup>

                            <MultiSelect 
                                :modelValue="selectedExtraColumns" 
                                :options="extraColumns" 
                                optionLabel="header" 
                                @update:modelValue="onToggleExtraColumns"
                                display="chip" 
                                placeholder="Hiện cột" 
                            />
                        </div>
                    </template>
                    <template #empty> No customers found. </template>
                    <template #loading> Loading customers data. Please wait. </template>
                    <Column selectionMode="multiple" frozen headerStyle="width: 3rem" ></Column>
                    <Column field="TDSUserName" header="TDS.Tài khoản" frozen>
                        <template #body="{ data }">
                            {{ data.TDS.Username }}
                        </template>
                    </Column>
                    <Column field="TDSPassword" header="TDS.Mật khẩu" v-if="isShowColumn('TDSPassword')">
                        <template #body="{ data }">
                            {{ data.TDS.Password }}
                        </template>
                    </Column>
                    <Column field="TDSToken" header="TDS.Token" v-if="isShowColumn('TDSPassword')">
                        <template #body="{ data }">
                            {{ data.TDS.Token }}
                        </template>
                    </Column>
                    <Column field="TiktokUsername" header="Tik.Tài khoản">
                        <template #body="{ data }">
                            {{ data.Tiktok.Username }}
                        </template>
                    </Column>
                    <Column field="TiktokPassword" header="Tik.Mật khẩu" v-if="isShowColumn('TDSPassword')">
                        <template #body="{ data }">
                            {{ data.Tiktok.Password }}
                        </template>
                    </Column>
                    <Column field="TDSXu" header="Xu" sortable>
                        <template #body="{ data }">
                            {{ data.TDS.Xu }}
                        </template>
                    </Column>
                    <Column field="TDSXuCuoi" header="Xu cuối" sortable>
                        <template #body="{ data }">
                            {{ data.TDS.XuThem }}
                        </template>
                    </Column>
                    <Column field="TDSXuThem" header="Xu thêm" sortable>
                        <template #body="{ data }">
                            {{ data.TDS.XuThem }}
                        </template>
                    </Column>
                    <Column field="Message" header="Thông báo" frozen alignFrozen="right" style="width: 25%">
                        <template #body="{ data }">
                            {{ data.Message }}
                        </template>
                    </Column>
                    <Column header="Chức năng" frozen alignFrozen="right" style="width: 5%">
                        <template #body>
                            <Button icon="pi pi-play" type="button" class="p-button-text" size="small"></Button>
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
