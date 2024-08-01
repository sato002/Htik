<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import { ExtraColumn } from '@/model/ExtraColumn';
import { Profile } from '../../main/model/Profile';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const extraColumns = ref<ExtraColumn[]>([
    new ExtraColumn('TDSPassword','TDS.Mật khẩu'),
    new ExtraColumn('TDSToken', 'TDS.Token'),
    new ExtraColumn('TiktokPassword', 'Tik.Mật khẩu')
]);
const selectedExtraColumns = ref<ExtraColumn[]>([]);

const profilesModel = ref<Profile[]>([]);
const loadingProfile = ref(true);
const selectedAccounts = ref();

const isShowCreateProfilePopup = ref(false);

const profileInPopupModel = ref<Profile>(new Profile());

onBeforeMount(() => {
    fetchProfiles();
});

const onToggleExtraColumns = (val) => {
    selectedExtraColumns.value = extraColumns.value.filter(col => val.includes(col));
};

const isShowColumn = (columnName) => {
    var exists = selectedExtraColumns.value.filter(col => col.field == columnName).length > 0;
    return exists;
};

const resetCreateProfilePopup = () => {
    profileInPopupModel.value = new Profile();
}

const fetchProfiles = async () => {
    const result = await window.electron.getAllProfiles();
    debugger
    if (result.success) {
        const profiles = JSON.parse(result.data) as Profile[];
        profilesModel.value = profiles;
        loadingProfile.value = false;
    } else {
        console.error('Error fetching profiles:', result.error);
    }
};

const execute = () => {
    window.electron.execute();
};

const saveProfile = async () => {
    console.log(profileInPopupModel.value);
    const profileInPopup = profileInPopupModel.value;
    profileInPopup.guidId = uuidv4();
    const result = await window.electron.createProfile({...profileInPopup});
    if (result.success) {
        profileInPopup.id = result.data;
        profilesModel.value.push(profileInPopup);
        isShowCreateProfilePopup.value = false;
        resetCreateProfilePopup();
        toast.add({ severity: 'success', summary: 'Thành công', detail: 'Thêm hồ sơ thành công!', life: 3000 });
    } else {
        console.error('Error fetching profiles:', result.error);
    }
}

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
                    :loading="loadingProfile"
                    resizableColumns 
                    columnResizeMode="expand"

                    :value="profilesModel"
                    v-model:selection="selectedAccounts"
                >
                    <template #header>
                        <div class="flex justify-content-between flex-column sm:flex-row">
                            <ButtonGroup>
                                <Button label="Bắt dầu" icon="pi pi-play" outlined @click="execute()"/>
                                <Button label="Kết thúc" icon="pi pi-stop" outlined/>
                                <Button label="Tạo Profile" icon="pi pi-plus" outlined @click="isShowCreateProfilePopup = true"/>
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
                            {{ data.tdsUsername }}
                        </template>
                    </Column>
                    <Column field="TDSPassword" header="TDS.Mật khẩu" v-if="isShowColumn('TDSPassword')">
                        <template #body="{ data }">
                            {{ data.tdsPassword }}
                        </template>
                    </Column>
                    <Column field="TDSToken" header="TDS.Token" v-if="isShowColumn('TDSPassword')">
                        <template #body="{ data }">
                            {{ data.tdsToken }}
                        </template>
                    </Column>
                    <Column field="TiktokUsername" header="Tik.Tài khoản">
                        <template #body="{ data }">
                            {{ data.tikUsername }}
                        </template>
                    </Column>
                    <Column field="TiktokPassword" header="Tik.Mật khẩu" v-if="isShowColumn('TDSPassword')">
                        <template #body="{ data }">
                            {{ data.tikPassword }}
                        </template>
                    </Column>
                    <Column field="TDSXu" header="Xu" sortable>
                        <template #body="{ data }">
                            {{ data.tdsTotalCoin }}
                        </template>
                    </Column>
                    <Column field="TDSXuCuoi" header="Xu cuối" sortable>
                        <template #body="{ data }">
                            {{ data.tdsTotalCoinJustEarned }}
                        </template>
                    </Column>
                    <Column field="TDSXuThem" header="Xu thêm" sortable>
                        <template #body="{ data }">
                            {{ data.tdsCoinJustEarned }}
                        </template>
                    </Column>
                    <Column field="Message" header="Thông báo" frozen alignFrozen="right" style="width: 25%">
                        <template #body="{ data }">
                            <!-- {{ data.Message }} -->
                        </template>
                    </Column>
                    <Column header="Chức năng" frozen alignFrozen="right" style="width: 5%">
                        <template #body>
                            <Button icon="pi pi-play" type="button" class="p-button-text" size="small"></Button>
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="isShowCreateProfilePopup" :style="{ width: '50vw' }" header="Tạo mới profile" :modal="true" class="p-fluid">
                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="tdsUsername">TDS.Tài khoản</label>
                            <InputText id="tdsUsername" required="true" autofocus v-model.trim="profileInPopupModel.tdsUsername" />
                        </div>
                        <div class="field col">
                            <label for="tdsPassword">TDS.Mật khẩu</label>
                            <InputText id="tdsPassword"  required="true" v-model.trim="profileInPopupModel.tdsPassword" />
                        </div>
                        
                    </div>
                    <div class="field">
                            <label for="tdsToken">TDS.Token</label>
                            <InputText id="tdsToken"  required="true" v-model.trim="profileInPopupModel.tdsToken" />
                        </div>
                    

                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="tikUsername">Tik.Tài khoản</label>
                            <InputText id="tikUsername"  required="true" v-model.trim="profileInPopupModel.tikUsername"/>
                        </div>
                        <div class="field col">
                            <label for="tikPassword">Tik.Mật khẩu</label>
                            <InputText id="tikPassword"  required="true" v-model.trim="profileInPopupModel.tikPassword" />
                        </div>
                    </div>
                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" text="" @click="isShowCreateProfilePopup = false" />
                        <Button label="Save" icon="pi pi-check" text="" @click="saveProfile" />
                    </template>
                </Dialog>
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
