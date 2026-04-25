import { defineStore } from "pinia";
import couponService from '@/service/coupon'
import { ref } from "vue";
import { DiscountType, type Coupon, type CouponPayload } from "@/types/Coupon";
import { useLoadingStore } from "./loading";
export const useCouponStore = defineStore('coupon', () => {

    const page = ref(1)
    const limit = ref(10)
    const lastPage = ref(1)
    const total = ref(0)
    const search = ref('')
    const coupons = ref<Coupon[]>([])
    const loadingStore = useLoadingStore()




    const initialCoupon: CouponPayload = {
        code: '',
        description: '',
        discount_type: DiscountType.PERCENT,
        discount_value: 0,
        min_order: 0,
        max_discount: 0,
        start_date: new Date(),
        end_date: new Date(),
        usage_limit: undefined,
        used_count: 0,
        is_active: true,
    }

    const editedCoupon = ref<CouponPayload>(
        { ...initialCoupon })







    async function getCoupons(p = page.value, l = limit.value, s = search.value) {
        loadingStore.doLoad()
        try {

            const res = await couponService.getCoupons(p, l, s)
            coupons.value = res.data.data
            page.value = res.data.page
            lastPage.value = res.data.lastPage
            total.value = res.data.total
        } finally {
            loadingStore.finishLoad()
        }
    }

    function setEditCoupon(coupon: Coupon) {
        editedCoupon.value = { ...coupon }
    }

    function cerateCoupon() {
        return couponService.createCoupon(editedCoupon.value)

    }

    function editCoupon() {

        if (editedCoupon.value.coupon_id)
            return couponService.editCoupon(editedCoupon.value.coupon_id, editedCoupon.value)

    }

    function toggleCouponStatus(id: number) {

        return couponService.toggleCouponStatus(id)
    }


    return {
        getCoupons, setEditCoupon, cerateCoupon, editCoupon, toggleCouponStatus, editedCoupon, coupons
    }
})