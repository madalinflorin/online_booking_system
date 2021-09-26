package ro.tuc.ds2020.dtos.builders;

import ro.tuc.ds2020.dtos.PackageDTO;
import ro.tuc.ds2020.entities.PackagePromotional;
import java.util.stream.Collectors;

public class PackageBuilder {

    private PackageBuilder() {}

    public static PackageDTO toDTO(PackagePromotional packagePromotional) {
        return new PackageDTO(
                packagePromotional.getId(),
                packagePromotional.getNameRo(),
                packagePromotional.getNameEn(),
                packagePromotional.getStartValidityPeriod(),
                packagePromotional.getEndValidityPeriod(),
                packagePromotional.getDiscount(),
                packagePromotional.getStartDiscountPeriod(),
                packagePromotional.getEndDiscountPeriod(),
                packagePromotional.getServices().stream().map(ServiceBuilder::toDTO).collect(Collectors.toSet())
        );
    }

    public static PackagePromotional toEntity(PackageDTO packageDTO) {
        return new PackagePromotional(
                packageDTO.getNameRo(),
                packageDTO.getNameEn(),
                packageDTO.getStartValidityPeriod(),
                packageDTO.getEndValidityPeriod(),
                packageDTO.getDiscount(),
                packageDTO.getStartDiscountPeriod(),
                packageDTO.getEndDiscountPeriod()
        );
    }

}
