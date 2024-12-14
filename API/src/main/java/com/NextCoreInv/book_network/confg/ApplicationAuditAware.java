package com.NextCoreInv.book_network.confg;

import com.NextCoreInv.book_network.user.User;
import org.springframework.context.ApplicationListener;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

public class ApplicationAuditAware implements AuditorAware<Integer> {
    @Override
    public Optional<Integer> getCurrentAuditor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
         if(authentication ==null ||
            !authentication.isAuthenticated() ||
                 authentication instanceof AnonymousAuthenticationToken){
             return Optional.empty();
         }
         User userprincipal = (User) authentication.getPrincipal();

        return Optional.ofNullable(userprincipal.getId());
    }
}
